"""Slice transparent sprite sheets into individual sprites.

Usage: python slice_sheets.py <out_dir>
Finds connected alpha blobs (on a downscaled, dilated mask), crops each one
from the full-resolution sheet and saves it as <sheet-key>_<nn>.png, plus a
labelled contact sheet per source sheet so the pieces can be named by hand.
"""
import sys, os, glob
from collections import deque
import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'source-assets')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'sliced')
os.makedirs(OUT, exist_ok=True)
SCALE = 2
THRESH = int(sys.argv[2]) if len(sys.argv) > 2 else 170
KEYS = {
    'ancient_greek_sailor_sprite_sheet': 'crewA', 'aristocratic_antagonist_sprite_sheet': 'antinous',
    'athena_goddess_character_sheet': 'athena', 'circe_sorceress_sprite_sheet': 'circe',
    'cyclops_character_sheet_of_poses_and_expressions': 'cyclops', 'greek_suitors_and_attendant_character_sheet': 'suitors',
    'multi_headed_sea_monster_sprite_sheet': 'scylla', 'odysseus_heroic_pose_sprite_sheet': 'odysseus',
    'penelope_character_sprite_sheet': 'penelope', 'poseidon_character_sticker_sheet': 'poseidon',
    'rugged_greek_sailor_character_sheet': 'eurylochus', 'siren_sisters_odyssey_character_sheet': 'sirens',
    'ancient_odyssey_icon_medallion_sheet': 'medal', 'enchanted_treasure_chest_asset_sheet': 'chest',
    'greek_mythology_puzzle_asset_atlas': 'puzzle', 'odyssey_adventure_inventory_collection': 'inv',
}

def blobs(mask, labels):
    h, w = mask.shape
    seen = np.zeros_like(mask, bool)
    out = []
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not seen[y, x]:
                q = deque([(y, x)]); seen[y, x] = True; lab = len(out) + 1
                y0 = y1 = y; x0 = x1 = x; n = 0
                while q:
                    cy, cx = q.popleft(); n += 1; labels[cy, cx] = lab
                    y0, y1, x0, x1 = min(y0, cy), max(y1, cy), min(x0, cx), max(x1, cx)
                    for ny, nx in ((cy+1, cx), (cy-1, cx), (cy, cx+1), (cy, cx-1)):
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True; q.append((ny, nx))
                out.append((n, x0, y0, x1, y1))
    return out

for f in sorted(glob.glob(os.path.join(SRC, 'characters', '*.png')) + glob.glob(os.path.join(SRC, 'props_ui', '*.png'))):
    name = os.path.splitext(os.path.basename(f))[0]
    key = KEYS.get(name, name[:10])
    im = Image.open(f).convert('RGBA')
    d = np.array(im.getchannel('A').resize((im.width // SCALE, im.height // SCALE), Image.BILINEAR)) > THRESH
    labels = np.zeros(d.shape, np.int32)
    allb = blobs(d, labels)
    found = [(b, i + 1) for i, b in enumerate(allb) if b[0] > 400]
    # tiny blobs (sparkles, loose hair) join the nearest big blob whose box contains them
    for i, b in enumerate(allb):
        if b[0] <= 400:
            cx, cy = (b[1] + b[3]) / 2, (b[2] + b[4]) / 2
            for (B, lab) in found:
                if B[1] - 6 <= cx <= B[3] + 6 and B[2] - 6 <= cy <= B[4] + 6:
                    labels[labels == i + 1] = lab; break
    found.sort(key=lambda t: (round(t[0][2] / 60), t[0][1]))
    sheet = im.copy(); dr = ImageDraw.Draw(sheet)
    for i, ((n, x0, y0, x1, y1), lab) in enumerate(found):
        box = (max(0, x0*SCALE - 4), max(0, y0*SCALE - 4), min(im.width, (x1+1)*SCALE + 4), min(im.height, (y1+1)*SCALE + 4))
        own = labels == lab
        grow = own.copy()
        for _ in range(3):
            g = grow.copy(); g[1:, :] |= grow[:-1, :]; g[:-1, :] |= grow[1:, :]; g[:, 1:] |= grow[:, :-1]; g[:, :-1] |= grow[:, 1:]; grow = g
        other = (labels > 0) & ~grow
        keep = Image.fromarray(((~other) * 255).astype('uint8')).resize(im.size, Image.NEAREST)
        piece = im.copy(); A = np.array(piece.getchannel('A')); A = np.minimum(A, np.array(keep)); piece.putalpha(Image.fromarray(A))
        crop = piece.crop(box)
        crop = crop.crop(crop.getbbox())
        crop.save(os.path.join(OUT, f'{key}_{i:02d}.png'))
        dr.rectangle(box, outline=(255, 0, 0, 255), width=2)
        dr.text((box[0] + 4, box[1] + 2), str(i), fill=(255, 255, 0, 255))
    bg = Image.new('RGBA', sheet.size, (70, 70, 90, 255)); bg.alpha_composite(sheet)
    bg.convert('RGB').resize((sheet.width // 2, sheet.height // 2)).save(os.path.join(OUT, f'_contact_{key}.jpg'), quality=80)
    print(key, len(found))
