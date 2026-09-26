# Walkthrough: Route Specific Firefox Domains through Tor

We have successfully created a local PAC (Proxy Auto-Configuration) file template and a Python management script to quickly add/remove domains. This walkthrough outlines the step-by-step setup and verification instructions.

---

## Files Created

* **PAC File**: [[local path redacted]](file://[local path redacted])
* **Management Script**: [[local path redacted]](file://[local path redacted])

---

## 🛠️ Step-by-Step Configuration

Choose **one** of the two approaches below to configure Firefox.

### Option 1: Native Firefox PAC File (No Extensions)

#### Step 1.1: Edit Your Domains
You can add your desired domain using the python management script:
```bash
python3 [local path redacted] add yourdomain.com
```
*(Optionally you can also add wildcards like `*.yourdomain.com`)*

#### Step 1.2: Enable local file URLs in Firefox (If using file:// path)
Due to security restrictions, modern Firefox might block PAC files loaded from the local filesystem (`file://`) unless this setting is updated:
1. Open Firefox and type `about:config` in the address bar. Press **Enter** and accept the risk warning.
2. Search for: `security.fileuri.strict_origin_policy`
3. Click the toggle button to change it from `true` to **`false`**.

#### Step 1.3: Configure the Proxy URL in Firefox
1. In Firefox, open **Settings** (or type `about:preferences` in the address bar).
2. Scroll to the bottom to **Network Settings** and click **Settings...**.
3. Select **Automatic proxy configuration URL**.
4. Paste the path to the created PAC file:
   ```text
   file://[local path redacted]
   ```
5. Check **Proxy DNS when using SOCKS v5** (this is vital to prevent your DNS requests from leaking your IP).
6. Click **OK**.

> [!TIP]
> **Alternative (Zero-Config Data URL)**:
> If you don't want to change `about:config`, you can convert the JavaScript code of your PAC file into a `data:` URI and paste it directly into the URL box. For example:
> `data:text/javascript,function FindProxyForURL(u,h){if(shExpMatch(h,"check.torproject.org")||shExpMatch(h,"yourdomain.com")){return "SOCKS5 127.0.0.1:9050; DIRECT";}return "DIRECT";}`

---

### Option 2: FoxyProxy Standard Extension (Easiest & Recomended)

If you prefer a visual GUI without modifying Firefox's internal files and policies:

1. **Install FoxyProxy Standard** from [addons.mozilla.org](https://addons.mozilla.org/firefox/addon/foxyproxy-standard/).
2. Click the FoxyProxy toolbar icon and choose **Settings**.
3. Click **Add** to create a proxy configuration:
   * **Proxy Type**: `SOCKS5`
   * **IP address/Domain**: `127.0.0.1`
   * **Port**: `9050`
   * Check **Send DNS through SOCKS5 proxy** (critical).
   * Save it.
4. Edit the new Tor proxy, go to the **Patterns** tab, and click **Add** to define your target domains:
   * **Pattern**: `*yourdomain.com*` (Wildcard)
   * Save it.
5. In the main FoxyProxy drop-down menu, select **"Use Enabled Proxies by Patterns and Order"**.

---

## 🔍 How to Verify It's Working

1. **Test Proxied Traffic**:
   Visit [check.torproject.org](https://check.torproject.org). 
   * Since `check.torproject.org` is included in your default PAC/FoxyProxy pattern list, it will show a green message: **"Congratulations. This browser is configured to use Tor."**
2. **Test Normal Traffic**:
   Visit a general IP checker like [ifconfig.me](https://ifconfig.me) or [icanhazip.com](https://icanhazip.com).
   * Since this is not in the proxy list, it will show your normal direct IP address.
