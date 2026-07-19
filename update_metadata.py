import os
import re

def main():
    print("Starting metadata update script...")
    
    # 1. Read version from pubspec.yaml in parent directory
    pubspec_path = os.path.join("..", "pubspec.yaml")
    version = "1.4.4" # Default fallback
    if os.path.exists(pubspec_path):
        try:
            with open(pubspec_path, "r", encoding="utf-8") as f:
                content = f.read()
                # Find version: X.Y.Z+W or X.Y.Z
                match = re.search(r"^version:\s*([0-9\.\+]+)", content, re.MULTILINE)
                if match:
                    full_version = match.group(1).strip()
                    version = full_version.split("+")[0]
                    print(f"Extracted version from pubspec.yaml: {version}")
        except Exception as e:
            print(f"Error reading pubspec.yaml: {e}")
    else:
        print("pubspec.yaml not found, using fallback version.")

    # 2. Check size of app-arm64-v8a-release.apk in parent build directory as split size
    build_apk_path = os.path.join("..", "build", "app", "outputs", "flutter-apk", "app-arm64-v8a-release.apk")
    size_mb = "24.1" # Default fallback for ARM64 split APK
    if os.path.exists(build_apk_path):
        try:
            bytes_size = os.path.getsize(build_apk_path)
            mb_value = bytes_size / (1024 * 1024)
            size_mb = f"{mb_value:.1f}"
            print(f"Calculated split APK size from build output: {size_mb} MB (bytes: {bytes_size})")
        except Exception as e:
            print(f"Error reading APK size: {e}")
    else:
        # Fallback to fat release APK in assets if split not found
        assets_apk_path = os.path.join("assets", "app-release.apk")
        if os.path.exists(assets_apk_path):
            try:
                bytes_size = os.path.getsize(assets_apk_path)
                mb_value = bytes_size / (1024 * 1024)
                size_mb = f"{mb_value:.1f}"
                print(f"Calculated fat APK size from assets: {size_mb} MB")
            except Exception as e:
                print(f"Error reading APK size: {e}")
        else:
            print("APK file not found on disk, using fallback size.")

    # 3. Update index.html
    html_path = "index.html"
    if os.path.exists(html_path):
        try:
            with open(html_path, "r", encoding="utf-8") as f:
                html_content = f.read()

            # Replace class="app-version-txt">...</span>
            html_content = re.sub(
                r'class="app-version-txt">[^<]*</span>',
                f'class="app-version-txt">{version}</span>',
                html_content
            )

            # Replace class="app-size-txt">...</span>
            html_content = re.sub(
                r'class="app-size-txt">[^<]*</span>',
                f'class="app-size-txt">{size_mb}</span>',
                html_content
            )

            with open(html_path, "w", encoding="utf-8") as f:
                f.write(html_content)
            print("Successfully updated index.html with new metadata!")
        except Exception as e:
            print(f"Error updating index.html: {e}")
    else:
        print("index.html not found!")

if __name__ == "__main__":
    main()
