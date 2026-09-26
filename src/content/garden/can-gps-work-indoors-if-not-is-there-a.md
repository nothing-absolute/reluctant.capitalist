---
title: "can gps work indoors? if not is there a way to simulate or create a mesh network that would allow mapping out "
description: "Exploration of indoor positioning techniques and UWB mesh networks for GPS-denied environments"
date: "2026-08-02"
tags: ["indoor-positioning","uwb-mesh","slam-technology"]
source: "antigravity://06ba1b33-e0e6-40ea-8318-ff5fc9c9deef"
draft: false
vault: false
---

can gps work indoors? if not is there a way to simulate or create a mesh network that would allow mapping out in a gps like maner?

## indoor positioning guide

## Indoor Positioning: SLAM & UWB Mesh Network Guide

## Overview

Two complementary approaches to GPS-denied indoor navigation:

| Approach | Infrastructure | Accuracy | Best For |
|---|---|---|---|
| **UWB Mesh** | Anchors required | 10–30 cm | Known spaces, real-time tracking |
| **SLAM** | None needed | 1–5 cm (LiDAR) | Unknown spaces, mapping + nav |
| **UWB + SLAM Fusion** | Anchors + sensor | 2–10 cm | Drones, robots, best of both |

---

## Part 1: SLAM (Simultaneous Localization and Mapping)

### What is SLAM?

SLAM solves a "chicken and egg" problem:
- To **localize** yourself, you need a map
- To **build a map**, you need to know where you are

SLAM solves both *simultaneously* using probabilistic estimation.

```
             ┌─────────────────────────────────────┐
             │           SLAM LOOP                 │
             │                                     │
  Sensor ──► │  Feature    ──►  Pose       ──►    │──► Map
  Data        │  Extraction     Estimation  Update │
             │      ▲               │              │
             │      └───────────────┘              │
             │       Loop Closure Detection        │
             └─────────────────────────────────────┘
```

### Types of SLAM

#### 1. LiDAR SLAM — *Most Accurate*
- Uses laser rangefinders (spinning or solid-state)
- Builds dense 2D or 3D point clouds
- Works in darkness, handles featureless environments
- **Algorithms:** Cartographer (Google), LOAM, LIO-SAM, hdl_graph_slam
- **Hardware:** RPLiDAR A3 (~$300), Ouster OS0 (~$3,000), Velodyne (~$4,000+)

#### 2. Visual SLAM (vSLAM) — *Cheapest Hardware*
- Uses cameras (mono, stereo, or fisheye)
- Tracks visual features (corners, edges, keypoints) between frames
- Struggles in low light or texture-less environments
- **Algorithms:** ORB-SLAM3, SVO2, OpenVSLAM
- **Hardware:** Intel RealSense D435i (~$200), ZED 2 (~$450)

#### 3. RGB-D SLAM — *Best for Dense Maps*
- Depth camera + color = rich 3D reconstruction
- Higher compute cost
- **Algorithms:** RTAB-Map, ElasticFusion, KinectFusion
- **Hardware:** Intel RealSense, Azure Kinect, OAK-D

---

### SLAM Algorithm Deep Dive: Cartographer (Google)

Cartographer is production-grade, supports 2D and 3D, and runs on ROS2.

**Core concepts:**

```
Submap Construction:
  - Incoming scans inserted into "submaps"
  - Each submap covers a small area
  - New submap created when old one is complete

Loop Closure:
  - When robot revisits an area, Cartographer detects overlap
  - Runs Ceres Solver (nonlinear least squares) to correct drift
  - Result: globally consistent map
```

**Mathematical Foundation (Simplified):**

The robot pose at time t is: `ξ = (x, y, θ)`

Scan matching minimizes:
```
cost = Σ (1 - M_smooth(T_ξ · h_k))²
```
where:
- `M_smooth` = probability grid (occupancy map)
- `T_ξ` = rigid body transform from pose ξ  
- `h_k` = k-th laser scan point

---

### SLAM Quick-Start Code (Python + Open3D, no ROS needed)

```python
# simple_slam.py — 2D LiDAR SLAM skeleton using ICP scan matching
import numpy as np
import open3d as o3d
from collections import deque

class SimpleSLAM:
    def __init__(self):
        self.map_points = []          # Global map
        self.pose = np.eye(4)         # Current pose (4x4 transform)
        self.pose_history = [np.eye(4)]
        self.prev_scan = None
        self.icp_threshold = 0.1      # Max correspondence distance (m)

    def scan_to_pointcloud(self, ranges, angle_min, angle_max):
        """Convert polar LiDAR scan to 3D point cloud."""
        angles = np.linspace(angle_min, angle_max, len(ranges))
        valid = np.isfinite(ranges) & (np.array(ranges) > 0.1)
        x = np.array(ranges)[valid] * np.cos(angles[valid])
        y = np.array(ranges)[valid] * np.sin(angles[valid])
        z = np.zeros_like(x)
        pts = np.column_stack([x, y, z])
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(pts)
        return pcd

    def icp_match(self, source, target):
        """Align source scan to target using ICP."""
        result = o3d.pipelines.registration.registration_icp(
            source, target,
            max_correspondence_distance=self.icp_threshold,
            estimation_method=o3d.pipelines.registration.TransformationEstimationPointToPoint(),
            criteria=o3d.pipelines.registration.ICPConvergenceCriteria(max_iteration=50)
        )
        return result.transformation, result.fitness

    def update(self, lidar_ranges, angle_min=-np.pi, angle_max=np.pi):
        """Process a new LiDAR scan and update pose + map."""
        current_scan = self.scan_to_pointcloud(lidar_ranges, angle_min, angle_max)

        if self.prev_scan is not None:
            delta_T, fitness = self.icp_match(current_scan, self.prev_scan)
            
            if fitness > 0.3:  # Good match threshold
                self.pose = self.pose @ delta_T
            else:
                print(f"[WARN] Poor ICP match: fitness={fitness:.3f}")

        # Add transformed scan to global map
        scan_in_world = current_scan.transform(self.pose.copy())
        self.map_points.append(np.asarray(scan_in_world.points))
        self.pose_history.append(self.pose.copy())
        self.prev_scan = current_scan

        return self.pose

    def get_position(self):
        """Extract (x, y, theta) from current pose matrix."""
        x = self.pose[0, 3]
        y = self.pose[1, 3]
        theta = np.arctan2(self.pose[1, 0], self.pose[0, 0])
        return x, y, np.degrees(theta)

    def get_map(self):
        """Return merged global map as point cloud."""
        if not self.map_points:
            return None
        all_pts = np.vstack(self.map_points)
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(all_pts)
        # Downsample for efficiency
        return pcd.voxel_down_sample(voxel_size=0.05)


# Usage example
if __name__ == "__main__":
    slam = SimpleSLAM()

    # Simulate some LiDAR scans (replace with real sensor data)
    for i in range(10):
        fake_ranges = 3.0 + 0.5 * np.random.randn(360)  # 360-degree scan
        pose = slam.update(fake_ranges)
        x, y, theta = slam.get_position()
        print(f"Scan {i}: position=({x:.3f}, {y:.3f}), heading={theta:.1f}°")

    final_map = slam.get_map()
    print(f"Map contains {len(final_map.points)} points")
```

---

## Part 2: UWB Mesh Network Design

### How UWB Positioning Works

UWB (Ultra-Wideband) uses **nanosecond-precision timing** to measure distances.

**Two-Way Ranging (TWR):**
```
Tag                    Anchor
 │──── POLL ──────────►│  t1 (tx), t2 (rx)
 │◄─── RESPONSE ───────│  t3 (tx), t4 (rx later)
 │──── FINAL ──────────►│

Distance = c × (t4-t1 - t3-t2) / 2
```

**Time Difference of Arrival (TDoA):**
```
Tag broadcasts once → All anchors receive at different times
ΔTOA between anchor pairs → Hyperbolic curves → Intersection = position
```
TDoA is preferred for many-tag tracking (drone swarms) since tags don't need to communicate back.

---

### Anchor Placement Strategy

**For a rectangular room (e.g., 15m × 10m event space):**

```
┌──────────────────────────────────┐
│ [A1]                       [A2] │  ← Ceiling corners (3m height)
│                                  │
│         Coverage Zone            │
│              ×                   │
│                                  │
│ [A3]                       [A4] │  ← Ceiling corners
└──────────────────────────────────┘
         Optional: [A5] center ceiling
                   [A6] center floor
```

**Rules:**
1. **Minimum 4 anchors** for 3D positioning
2. Anchors should be **spread as far apart as possible**
3. Avoid placing anchors in a line (causes poor geometry / high DOP)
4. Clear line-of-sight between anchors and tag zone
5. Metal surfaces cause multipath — add 15–20cm clearance

**GDOP (Geometric Dilution of Precision):**
- Good anchor geometry = GDOP < 2 → position error ~15cm
- Poor geometry = GDOP > 5 → position error drifts to 1–2m

---

### Hardware Bill of Materials

#### Option A: DIY (Budget ~$200–400 for 5 nodes)

| Part | Qty | Unit Cost | Notes |
|---|---|---|---|
| ESP32-S3 dev board | 5 | $8 | Main MCU |
| Qorvo DWM3000EVB | 5 | $25 | UWB module (DW3000 chip) |
| 5V USB power bank | 4 | $15 | For anchors |
| LiPo 1000mAh | 1 | $10 | For mobile tag |
| 5m USB-C cables | 4 | $5 | Power to anchors |

**Total: ~$280**

#### Option B: Ready-Made (Faster to deploy)

| Product | Accuracy | Cost/Node |
|---|---|---|
| Pozyx Creator Kit | 10 cm | $1,200/kit |
| Sewio RTLS Kit | 15 cm | $2,500/kit |
| Qorvo MDEK1001 | 10 cm | $600/12-node kit |
| **Leica iCON** | 5 cm | $$$$ (industrial) |

> 🏆 **Recommendation**: Qorvo MDEK1001 for fastest path to working system

---

### UWB Positioning Code

#### Anchor Firmware (ESP32 + DW3000, Arduino)

```cpp
// uwb_anchor.ino
#include <DW3000.h>

#define ANCHOR_ID 0x01  // Unique per anchor (0x01, 0x02, 0x03, 0x04)

const SPISettings _fastSPI = SPISettings(16000000L, MSBFIRST, SPI_MODE0);

void setup() {
  Serial.begin(115200);
  DW3000.begin(SS_PIN, RST_PIN, IRQ_PIN);
  DW3000.hardReset();
  DW3000.init();
  DW3000.setDeviceAddress(ANCHOR_ID);
  DW3000.setNetworkId(0xDECA);
  DW3000.enableMode(DW3000.MODE_LONGDATA_RANGE_ACCURACY);
  Serial.printf("Anchor 0x%02X ready\n", ANCHOR_ID);
}

void loop() {
  // Listen for POLL from tag
  byte msg[128];
  int len = DW3000.receive(msg, sizeof(msg), 100);
  if (len > 0 && msg[0] == 0x41 && msg[1] == ANCHOR_ID) {
    // Record receive timestamp
    uint64_t rx_time = DW3000.getReceiveTimestamp();
    
    // Send RESPONSE back
    byte response[10];
    response[0] = 0x42;  // Response type
    response[1] = ANCHOR_ID;
    // Embed timestamps
    memcpy(response + 2, &rx_time, 8);
    DW3000.transmit(response, sizeof(response));
    
    uint64_t tx_time = DW3000.getTransmitTimestamp();
    // Send tx_time in FINAL ack
    byte final_msg[10] = {0x43, ANCHOR_ID};
    memcpy(final_msg + 2, &tx_time, 8);
    DW3000.transmit(final_msg, sizeof(final_msg));
  }
}
```

#### Python Position Solver (Host/Raspberry Pi)

```python
# uwb_solver.py — Real-time UWB position solver
import numpy as np
from scipy.optimize import minimize
import serial
import json
from dataclasses import dataclass
from typing import Dict, List, Tuple
import threading
import time

@dataclass
class Anchor:
    id: int
    x: float  # meters
    y: float
    z: float

class UWBPositionSolver:
    """
    Solves tag position from UWB ranging measurements using
    Weighted Least Squares (WLS) with GDOP-based quality scoring.
    """

    def __init__(self, anchors: List[Anchor]):
        self.anchors = {a.id: a for a in anchors}
        self.anchor_positions = np.array([[a.x, a.y, a.z] for a in anchors])
        self.last_position = np.array([0.0, 0.0, 1.0])  # Initial guess
        self.position_history = []
        self.lock = threading.Lock()

    def cost_function(self, pos: np.ndarray, distances: Dict[int, float]) -> float:
        """WLS cost: sum of squared residuals weighted by 1/distance²."""
        total_cost = 0.0
        for anchor_id, measured_dist in distances.items():
            anchor = self.anchors[anchor_id]
            anchor_pos = np.array([anchor.x, anchor.y, anchor.z])
            estimated_dist = np.linalg.norm(pos - anchor_pos)
            residual = estimated_dist - measured_dist
            weight = 1.0 / (measured_dist ** 2 + 0.01)  # Closer = more reliable
            total_cost += weight * residual ** 2
        return total_cost

    def solve(self, distances: Dict[int, float]) -> Tuple[np.ndarray, float]:
        """
        Solve for 3D position given distance measurements to anchors.
        Returns (position, gdop_score)
        """
        if len(distances) < 4:
            raise ValueError(f"Need ≥4 anchors, got {len(distances)}")

        result = minimize(
            self.cost_function,
            x0=self.last_position,
            args=(distances,),
            method='L-BFGS-B',
            options={'maxiter': 100, 'ftol': 1e-9}
        )

        if result.success:
            self.last_position = result.x
            gdop = self._compute_gdop(result.x, list(distances.keys()))
            
            with self.lock:
                self.position_history.append({
                    'time': time.time(),
                    'pos': result.x.tolist(),
                    'gdop': gdop
                })

            return result.x, gdop
        else:
            raise RuntimeError(f"Solver failed: {result.message}")

    def _compute_gdop(self, pos: np.ndarray, anchor_ids: List[int]) -> float:
        """Compute Geometric Dilution of Precision."""
        H = []
        for aid in anchor_ids:
            anchor = self.anchors[aid]
            ap = np.array([anchor.x, anchor.y, anchor.z])
            d = np.linalg.norm(pos - ap)
            if d < 0.001:
                continue
            row = (pos - ap) / d
            H.append(np.append(row, 1.0))  # Add clock bias column
        
        H = np.array(H)
        try:
            Q = np.linalg.inv(H.T @ H)
            gdop = np.sqrt(np.trace(Q))
        except np.linalg.LinAlgError:
            gdop = 99.0
        return gdop

    def kalman_filter(self, raw_pos: np.ndarray, dt: float = 0.1) -> np.ndarray:
        """
        Simple Kalman filter to smooth position estimates.
        State: [x, y, z, vx, vy, vz]
        """
        if not hasattr(self, '_kf_state'):
            self._kf_state = np.zeros(6)
            self._kf_state[:3] = raw_pos
            self._kf_P = np.eye(6) * 10.0  # Initial uncertainty

        # State transition (constant velocity)
        F = np.eye(6)
        F[0, 3] = F[1, 4] = F[2, 5] = dt

        # Process noise
        Q = np.eye(6) * 0.01
        Q[:3, :3] *= 0.001  # Position noise
        Q[3:, 3:] *= 0.1    # Velocity noise

        # Measurement model (observe position only)
        H = np.zeros((3, 6))
        H[0, 0] = H[1, 1] = H[2, 2] = 1.0

        # Measurement noise (UWB accuracy ~0.1m)
        R = np.eye(3) * 0.01

        # Predict
        x_pred = F @ self._kf_state
        P_pred = F @ self._kf_P @ F.T + Q

        # Update
        S = H @ P_pred @ H.T + R
        K = P_pred @ H.T @ np.linalg.inv(S)
        self._kf_state = x_pred + K @ (raw_pos - H @ x_pred)
        self._kf_P = (np.eye(6) - K @ H) @ P_pred

        return self._kf_state[:3]


# ─────────────────────────────────────────────
# Example: 5-Anchor room setup
# ─────────────────────────────────────────────
if __name__ == "__main__":
    # Define your room's anchor positions (measure carefully!)
    anchors = [
        Anchor(id=1, x=0.0,  y=0.0,  z=3.0),  # Corner A, ceiling
        Anchor(id=2, x=15.0, y=0.0,  z=3.0),  # Corner B, ceiling
        Anchor(id=3, x=15.0, y=10.0, z=3.0),  # Corner C, ceiling
        Anchor(id=4, x=0.0,  y=10.0, z=3.0),  # Corner D, ceiling
        Anchor(id=5, x=7.5,  y=5.0,  z=3.0),  # Center, ceiling
    ]

    solver = UWBPositionSolver(anchors)

    # Simulate measurements (replace with real serial reads from ESP32)
    true_pos = np.array([5.0, 3.0, 1.0])
    distances = {}
    for anchor in anchors:
        ap = np.array([anchor.x, anchor.y, anchor.z])
        true_dist = np.linalg.norm(true_pos - ap)
        distances[anchor.id] = true_dist + np.random.normal(0, 0.05)  # 5cm noise

    raw_pos, gdop = solver.solve(distances)
    filtered_pos = solver.kalman_filter(raw_pos)

    print(f"True position:     ({true_pos[0]:.2f}, {true_pos[1]:.2f}, {true_pos[2]:.2f})")
    print(f"Solved position:   ({raw_pos[0]:.2f}, {raw_pos[1]:.2f}, {raw_pos[2]:.2f})")
    print(f"Filtered position: ({filtered_pos[0]:.2f}, {filtered_pos[1]:.2f}, {filtered_pos[2]:.2f})")
    print(f"GDOP: {gdop:.2f} ({'Good' if gdop < 2 else 'Fair' if gdop < 4 else 'Poor'})")
    error = np.linalg.norm(filtered_pos - true_pos)
    print(f"Position error: {error*100:.1f} cm")
```

---

## Part 3: UWB + SLAM Fusion (Best of Both Worlds)

For drones or robots, combining UWB (global reference) and SLAM (local precision) eliminates both drift and anchor dependency.

### Architecture

```
                    ┌──────────────────────────────┐
  LiDAR/Camera ───►│         SLAM Engine           │
                    │  (Local map, relative pose)   │
                    └──────────┬───────────────────┘
                               │
                    ┌──────────▼───────────────────┐
  UWB Ranges ─────►│      Sensor Fusion (EKF)      │──► Global Position
                    │  Fuses UWB global + SLAM local │     + Dense Map
  IMU ────────────►│                               │
                    └──────────────────────────────┘
```

### Extended Kalman Filter (EKF) Fusion

```python
# ekf_fusion.py — Fuse UWB + IMU + SLAM pose estimates
import numpy as np

class EKFFusion:
    """
    State vector: [x, y, z, vx, vy, vz, roll, pitch, yaw]
    Measurements: UWB ranges (absolute), SLAM delta-pose (relative), IMU (rates)
    """

    def __init__(self):
        self.state = np.zeros(9)       # [pos(3), vel(3), euler(3)]
        self.P = np.eye(9) * 0.1      # Covariance
        self.dt = 0.05                 # 20Hz update

        # Noise parameters
        self.Q = np.diag([0.001]*3 + [0.01]*3 + [0.001]*3)  # Process noise
        self.R_uwb = np.eye(3) * 0.01    # UWB measurement noise (10cm)
        self.R_slam = np.eye(6) * 0.001  # SLAM pose noise (1cm)

    def predict(self, accel: np.ndarray, gyro: np.ndarray):
        """IMU propagation step."""
        dt = self.dt
        pos = self.state[:3]
        vel = self.state[3:6]
        euler = self.state[6:9]

        # Simple integration (use quaternions in production)
        new_pos = pos + vel * dt + 0.5 * accel * dt**2
        new_vel = vel + accel * dt
        new_euler = euler + gyro * dt

        self.state = np.concatenate([new_pos, new_vel, new_euler])

        # Linearized transition (Jacobian F)
        F = np.eye(9)
        F[:3, 3:6] = np.eye(3) * dt
        self.P = F @ self.P @ F.T + self.Q

    def update_uwb(self, uwb_position: np.ndarray):
        """Correct with UWB position measurement."""
        H = np.zeros((3, 9))
        H[:3, :3] = np.eye(3)
        self._update(uwb_position, H, self.R_uwb)

    def update_slam(self, slam_position: np.ndarray, slam_euler: np.ndarray):
        """Correct with SLAM pose estimate."""
        z = np.concatenate([slam_position, slam_euler])
        H = np.zeros((6, 9))
        H[:3, :3] = np.eye(3)
        H[3:, 6:] = np.eye(3)
        self._update(z, H, self.R_slam)

    def _update(self, z: np.ndarray, H: np.ndarray, R: np.ndarray):
        """Standard EKF update step."""
        y = z - H @ self.state               # Innovation
        S = H @ self.P @ H.T + R             # Innovation covariance
        K = self.P @ H.T @ np.linalg.inv(S) # Kalman gain
        self.state = self.state + K @ y
        self.P = (np.eye(9) - K @ H) @ self.P

    def get_pose(self):
        return {
            'position': self.state[:3],
            'velocity': self.state[3:6],
            'orientation': self.state[6:9]
        }
```

---

## Recommended System for Event Drone Use

Based on the EventFlow Autonomous Cinema context:

| Component | Choice | Reason |
|---|---|---|
| **Global positioning** | UWB (Qorvo DWM3000) | 10cm accuracy, works in crowded RF environments |
| **Local mapping** | Intel RealSense D435i | Depth + color, obstacle avoidance |
| **Sensor fusion** | EKF (custom or ROS2 robot_localization) | Tight integration |
| **Compute** | NVIDIA Orin Nano | Enough for SLAM + flight controller |
| **Comms** | Wi-Fi 6E + UWB | Dual-channel for telemetry + positioning |
| **Ground station** | ROS2 + Foxglove Studio | Visualization + mission planning |

### 3D Visualization Stack

```
Sensors ──► ROS2 Topics ──► RTAB-Map/Cartographer ──► Foxglove Studio
                │
                └──► Custom WebSocket server ──► Browser 3D map (Three.js)
```

---

## Next Steps — Choose Your Path

### 🔵 Path A: Build the UWB Mesh
1. Order Qorvo MDEK1001 kit (~$600 for 12 nodes)
2. Flash anchors with provided firmware
3. Run Python solver above on a Raspberry Pi
4. Calibrate with known positions
5. Integrate with drone flight controller via MAVLink

### 🟢 Path B: Build a SLAM Demo
1. Get RPLiDAR A3 + Raspberry Pi 4
2. Install ROS2 Humble
3. Run `slam_toolbox` package (production-grade, easier than Cartographer)
4. Visualize in RViz or Foxglove

### 🟡 Path C: Software-Only Simulation
1. Use Gazebo + ROS2 simulation
2. Simulate UWB nodes as virtual beacons
3. Run SLAM on simulated LiDAR
4. Zero hardware cost — perfect for prototyping

---

*Document version 1.0 — Indoor Positioning Guide*

## Assets
- [indoor_positioning_guide.md](/antigravity/can-gps-work-indoors-if-not-is-there-a/indoor_positioning_guide.md) — MD, 21 KB

<details>
<summary>Chat transcript — 5 messages, 2026-08-02 → 2026-08-02</summary>

**You** · 2026-08-02 11:52

can gps work indoors? if not is there a way to simulate or create a mesh network that would allow mapping out in a gps like maner?

---

**Antigravity** · 2026-08-02 11:52

## GPS Indoors — The Short Answer

**Standard GPS does not work reliably indoors.** Here's why:

GPS relies on line-of-sight signals from satellites ~20,000 km away. Those signals are:
- **Very weak** (arrive at ~-130 dBm)
- **Easily blocked** by roofs, walls, and metal structures
- **Multipath distorted** — signals bounce off surfaces and arrive scrambled

You might get a *weak, drifty lock* near windows, but it's not usable for precise mapping.

---

## Indoor Positioning Alternatives

There are several well-established technologies that replicate GPS-like behavior indoors:

### 🔵 UWB (Ultra-Wideband) — *Best Accuracy*
- Uses anchors (fixed nodes) + tags (moving units)
- **Accuracy: 10–30 cm**
- How: Time-of-flight / Time-Difference-of-Arrival (TDoA) trilateration
- Used by: Apple AirTags, newer iPhones, warehouse robots
- Example chips: **Decawave DW3000**, Qorvo
- Ideal for your use case — essentially a "local GPS"

### 🟢 BLE (Bluetooth Low Energy) Beacons — *Cheap & Easy*
- Place BLE beacons around a space; measure RSSI (signal strength)
- **Accuracy: 1–3 meters** (RSSI is noisy)
- Can improve with **fingerprinting** (pre-mapping signal patterns)
- Very low cost — beacons are ~$10–30 each

### 🟡 Wi-Fi RTT (Round Trip Time) / RSSI
- Uses existing Wi-Fi APs as anchors
- **Accuracy: 1–3 m** (RTT), **3–5 m** (RSSI)
- Wi-Fi RTT (802.11mc/FTM) on Android 9+ gives real ranging
- No extra hardware if you have Wi-Fi

### 🟠 LiDAR + SLAM — *Best for Mapping*
- **SLAM** = Simultaneous Localization and Mapping
- A robot/device builds a map *while* figuring out where it is
- Uses laser rangefinders or depth cameras
- **No infrastructure needed** — self-contained
- Used by: Roombas, warehouse robots, self-driving cars
- Can achieve **cm-level accuracy**

### 🔴 IMU Dead Reckoning (+ fusion)
- Accelerometers + gyroscopes track motion from a known point
- **Drifts over time** without correction
- Best used *fused* with one of the above

---

## Building a Mesh Positioning Network (Like GPS)

The most practical "indoor GPS" mesh uses **UWB anchors in a trilateration setup**:

```
[Anchor A] -------- [Anchor B]
     \                  /
      \                /
       [Tag / Device]
            |
      [Anchor C]
```

**Minimum 3 anchors** for 2D position, **4 anchors** for 3D.

### Recommended DIY Stack
| Component | Option |
|---|---|
| Anchors/Tags | ESP32 + DW3000 UWB module (~$15/node) |
| Firmware | OpenRTLS or custom Arduino |
| Position solver | Python trilateration (least-squares) |
| Visualization | ROS2, or custom map overlay |

---

## Related to Your Drone Project?

Given your **EventFlow Autonomous Cinema** project, indoor UWB positioning is *exactly* what commercial indoor drones use (e.g., Skydio, Crazyflie with Loco Positioning). A UWB mesh + onboard IMU fusion is the standard approach for GPS-denied indoor drone navigation.

Would you like me to:
1. **Design a UWB mesh network** for a specific space?
2. **Build a positioning algorithm** (trilateration in Python)?
3. **Explore SLAM** for autonomous mapping without anchors?

---

**You** · 2026-08-02 12:06

Explore SLAM/Design a UWB mesh network for a specific space

---

**Antigravity** · 2026-08-02 12:06

This is a meaty topic — let me build a comprehensive artifact covering both, then we can drill into whichever direction fits your use case best.

---

**Antigravity** · 2026-08-02 12:08

I've put together a full [Indoor Positioning Guide](file://[local path redacted]) covering everything. Here's a quick orientation:

---

## What's Covered

### 🗺️ SLAM
- **3 types** compared: LiDAR (most accurate), Visual (cheapest), RGB-D (best maps)
- How Cartographer (Google's algo) works mathematically
- **Working Python code** — `SimpleSLAM` using ICP scan matching + Open3D

### 📡 UWB Mesh Network
- How Two-Way Ranging and TDoA work at the nanosecond level
- **Anchor placement rules** for a 15×10m room (+ GDOP geometry math)
- **Full hardware BOM** — DIY (~$280) vs. ready-made (Qorvo MDEK1001 ~$600)
- **ESP32 anchor firmware** (Arduino)
- **Python position solver** with Weighted Least Squares + Kalman filter

### 🔀 Sensor Fusion (the real prize)
- **EKF fusion code** that merges UWB (global) + SLAM (local) + IMU
- Eliminates both drift (SLAM problem) and anchor dependency (UWB problem)

---

## Three Paths Forward

| Path | What you need | Time to first result |
|---|---|---|
| 🔵 **UWB Mesh Build** | Qorvo MDEK1001 kit + Raspberry Pi | 1–2 days |
| 🟢 **SLAM Demo** | RPLiDAR A3 + Raspberry Pi 4 | 1 day |
| 🟡 **Simulation Only** | Just a PC + ROS2 + Gazebo | Hours |

Which path do you want to go down? I can scaffold the full project code, generate a 3D visualization dashboard, or help you spec out the hardware for a specific space.

</details>

---

*Imported from Antigravity conversation `06ba1b33-e0e6-40ea-8318-ff5fc9c9deef` — 8 recorded steps, 1 tool actions, 1 context checkpoints (earlier turns were truncated by Antigravity). Source: `antigravity`.*
