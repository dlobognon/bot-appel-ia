import os
import sys
import shutil

try:
    from PIL import Image
except Exception:
    print('Pillow non trouvé. Exécutez `pip install pillow` puis relancez ce script.')
    raise


def compress_dir(dirpath, quality=75):
    backup_dir = os.path.join(dirpath, 'backups')
    os.makedirs(backup_dir, exist_ok=True)
    files = sorted(os.listdir(dirpath))
    for fname in files:
        lower = fname.lower()
        if lower.endswith(('.jpg', '.jpeg', '.png')) and fname.startswith('hero'):
            path = os.path.join(dirpath, fname)
            bak = os.path.join(backup_dir, fname)
            if not os.path.exists(bak):
                shutil.copy2(path, bak)
            try:
                im = Image.open(path)
                if im.mode in ("RGBA", "P"):
                    im = im.convert("RGB")
                orig_size = os.path.getsize(path)
                im.save(path, format='JPEG', optimize=True, quality=quality)
                new_size = os.path.getsize(path)
                print(f"{fname}: {orig_size} -> {new_size} bytes")
            except Exception as e:
                print(f"Erreur pour {fname}: {e}")


if __name__ == '__main__':
    dirpath = sys.argv[1] if len(sys.argv) > 1 else '.'
    try:
        quality = int(sys.argv[2]) if len(sys.argv) > 2 else 75
    except ValueError:
        quality = 75
    compress_dir(dirpath, quality)
