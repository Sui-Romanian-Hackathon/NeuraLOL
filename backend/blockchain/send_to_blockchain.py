import subprocess
import json

def send_to_blockchain(image_hash, result):
    print("Trimitere la blockchain...")

    cmd = [
        "sui", "client", "call",
        "--package", "<PACKAGE_ID>",
        "--module", "garbage_detector",
        "--function", "store_detection",
        "--args", f'"{image_hash}"', f'"{result}"',
        "--gas-budget", "20000000"
    ]

    try:
        output = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
        print("\n=== Răspuns blockchain ===")
        print(output)
        print("==========================")
    except subprocess.CalledProcessError as e:
        print("Eroare la trimitere pe blockchain!")
        print(e.output)
