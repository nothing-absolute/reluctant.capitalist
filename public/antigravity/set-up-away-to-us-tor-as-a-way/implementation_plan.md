# Implementation Plan - Use Tor to Hide IP in Firefox for Specific Domains

We will configure Firefox to route traffic through the local Tor SOCKS proxy (`127.0.0.1:9050`) only for specific user-defined domains, while routing all other web traffic directly (using your normal IP address).

We verified that Tor is already installed and running on your system, listening on port `9050`.

We propose two main approaches:
1. **Proxy Auto-Configuration (PAC) File (No Extensions)**: A native Firefox feature using a lightweight JavaScript rule file.
2. **FoxyProxy Standard Extension (GUI-based)**: A popular browser extension that offers a visual interface to manage patterns and proxy rules.

---

## Proposed Approaches

### Approach 1: Proxy Auto-Configuration (PAC) File
This method uses a small JavaScript file that tells Firefox exactly when to use Tor.

1. **Create a local PAC file** (e.g., `~/.tor-proxy.pac`):
   ```javascript
   function FindProxyForURL(url, host) {
       // Replace "example.com" with your target domain
       if (shExpMatch(host, "example.com") || shExpMatch(host, "*.example.com")) {
           return "SOCKS5 127.0.0.1:9050; SOCKS 127.0.0.1:9050; DIRECT";
       }
       return "DIRECT";
   }
   ```
2. **Configure Firefox**:
   * Open Firefox **Settings** -> search for `proxy` -> click **Settings...** under *Network Settings*.
   * Select **Automatic proxy configuration URL**.
   * Enter: `file://[local path redacted]` (or the absolute path where you save the file).
   * Check **Proxy DNS when using SOCKS v5** (important to prevent DNS leaks).
   * Click **OK**.
   * *Note on Firefox security:* If Firefox blocks loading the local PAC file, go to `about:config`, search for `security.fileuri.strict_origin_policy`, set it to `false`, and restart Firefox. Alternatively, you can use a base64-encoded `data:` URI in the settings to avoid file-system restriction issues entirely.

---

### Approach 2: FoxyProxy Standard (Recommended for Ease of Use)
This is the most user-friendly way to manage proxy rules via a visual interface.

1. **Install FoxyProxy Standard**:
   * Open Firefox and go to [FoxyProxy Standard on Firefox Add-ons](https://addons.mozilla.org/firefox/addon/foxyproxy-standard/).
   * Click **Add to Firefox**.
2. **Configure Tor Proxy in FoxyProxy**:
   * Click the FoxyProxy icon in the toolbar and select **Options** / **Settings**.
   * Click **Add** to create a new proxy profile:
     * **Title**: `Tor SOCKS`
     * **Proxy Type**: `SOCKS5`
     * **IP address/Domain**: `127.0.0.1`
     * **Port**: `9050`
     * Check **Send DNS through SOCKS5 proxy** (critical for privacy).
     * Click **Save**.
3. **Set Up Domain Rules (Patterns)**:
   * Edit the newly created `Tor SOCKS` proxy profile and click the **Patterns** tab.
   * Add a new pattern:
     * **Pattern Name**: `Target Domain`
     * **Pattern**: `*example.com*` (or the specific domain you want to hide your IP on).
     * **Type**: `Wildcard`
     * Click **Save**.
4. **Enable Pattern Mode**:
   * Click the FoxyProxy toolbar icon and change the mode to **"Use Enabled Proxies by Patterns and Order"**.

---

## Verification Plan

We will verify the setup using:
1. **Normal browsing**: Visit `https://check.torproject.org/api/ip` (or generic IP checkers like `ifconfig.me`) and confirm it shows your normal IP address.
2. **Proxied browsing**: Visit the configured target domain and verify it resolves successfully. If we configure a test pattern for `check.torproject.org`, visiting it should display: `"IsTor": true`.
