"""Export the runtime art for the Odyssey review game.

Reads sliced sprites (tools/slice_sheets.py output in ../sliced) and the
environment paintings, and writes resized WebP files into the lesson's
assets folder. Pose names here are the names the story script uses.
"""
import os
import json
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SL = os.path.join(HERE, '..', 'sliced')
ENV = os.path.join(HERE, '..', 'source-assets', 'environments')
OUT = os.path.join(HERE, '..', '..', '..', 'materials', 'Unit 1 Review - Learning and Cognition', 'assets')

POSES = {
    'odysseus': dict(stand='odysseus_00', walk='odysseus_01', point='odysseus_02', think='odysseus_03', sword='odysseus_04',
                     listen='odysseus_05', fist='odysseus_06', sit='odysseus_07'),
    'athena': dict(stand='athena_00', offer='athena_01', point='athena_02', arms='athena_03', open='athena_04', magic='athena_05',
                   walk='athena_06', heart='athena_07'),
    'penelope': dict(stand='penelope_00', pray='penelope_01', scroll='penelope_02', think='penelope_03', gesture='penelope_04',
                     firm='penelope_05', sit='penelope_06', hope='penelope_07'),
    # eury2, pol2, elp2: second-round sheets, drawn so the crew no longer look like Odysseus
    'eurylochus': dict(stand='eury2_00', rope='eury2_01', argue='eury2_02', lookout='eury2_03', despair='eury2_04', arms='eury2_05'),
    'poseidon': dict(stand='poseidon_00', point='poseidon_03', calm='poseidon_02'),
    'circe': dict(potion='circe_01', magic='circe_02', stand=('circe_00', 0), point=('circe_00', 1), sit=('circe_03', 1)),
    'cyclops': dict(stand='cyclops_00', walk='cyclops_01', reach='cyclops_03', boulder='cyclops_04', fists='cyclops_06', punch='cyclops_07'),
    'antinous': dict(stand='antinous_00', toast='antinous_01', lounge='antinous_02', point='antinous_03', sneer='antinous_04', alarm='antinous_05'),
    'scylla': dict(rise='scylla_00', strike='scylla_02', coil='scylla_03'),
    'sirens': dict(dark='sirens_00', fair='sirens_01'),
    'elpenor': dict(stand='elp3_00', sit='elp3_07'),
    'polites': dict(stand='pol2_00', sit='pol2_01', point='pol2_06'),
    'tiresias': dict(stand='crewA_10', point='crewA_11'),
}
FACES = {
    'odysseus': dict(calm='odysseus_08', wary='odysseus_09', worried='odysseus_10', shout='odysseus_11'),
    'athena': dict(calm='athena_08', warm='athena_09', stern='athena_10', awe='athena_11'),
    'penelope': dict(calm='penelope_08', sad='penelope_09', wary='penelope_10', warm='penelope_11'),
    'eurylochus': dict(calm='eury2_08', wary='eury2_09', tired='eury2_10', angry='eury2_11'),
    'poseidon': dict(calm='poseidon_05', smug='poseidon_06', roar='poseidon_07', stern='poseidon_08', cold='poseidon_09', angry='poseidon_10'),
    'circe': dict(calm='circe_04', smile='circe_05', stern='circe_06', bored='circe_07'),
    'cyclops': dict(calm='cyclops_08', wary='cyclops_09', angry='cyclops_10', roar='cyclops_11', up='cyclops_12', think='cyclops_13', howl='cyclops_14'),
    'antinous': dict(smug='antinous_06', calm='antinous_07', angry='antinous_08', alarm='antinous_09'),
    'scylla': dict(calm='scylla_05', roar='scylla_06', hiss='scylla_10'),
    'sirens': dict(calm='sirens_08', sing='sirens_13', fair='sirens_16', fairsing='sirens_21'),
    'elpenor': dict(calm='elp3_09', awe='elp3_08', sad='elp3_11'),
    'polites': dict(calm='pol2_08', worried='pol2_09', pain='pol2_11'),
    'tiresias': dict(calm='crewA_15', speak='crewA_16', think='crewA_17'),
}
PROPS = {
    'coin': 'puzzle_25', 'owl': 'inv_04', 'moly': 'puzzle_23', 'wax': 'inv_10', 'laurel': 'inv_08', 'lyre': 'inv_07',
    'lantern': 'inv_02', 'bag': 'inv_09', 'amphora': 'inv_06', 'scroll': 'inv_00', 'compass': 'inv_01', 'rope': 'inv_05',
    'key': 'chest_00', 'chest': 'chest_01', 'chest_open': 'chest_03', 'sparkle': 'chest_04', 'card_back': 'puzzle_00',
    'card_owl': 'puzzle_01', 'card_temple': 'puzzle_03', 'scales': 'puzzle_21', 'gem': 'puzzle_26', 'vase': 'puzzle_20',
    'shard1': 'puzzle_13', 'shard2': 'puzzle_14', 'shard3': 'puzzle_15', 'shard4': 'puzzle_16', 'shard5': 'puzzle_17',
    'medal_mind': 'medal_00', 'medal_chain': 'medal_01', 'medal_tree': 'medal_02', 'medal_compass': 'medal_04',
    'medal_scroll': 'medal_05', 'medal_exam': 'medal_06', 'medal_bag': 'medal_08', 'medal_gear': 'medal_09', 'medal_ship': 'medal_11',
    'lock': 'medal_12', 'unlock': 'medal_13', 'medal_owl': 'medal_14', 'medal_check': 'medal_15', 'spear': 'inv_03',
}
ENVS = {
    'troy': 'a_wide_cinematic_painterly_illustrated_scene_of.png', 'circe': 'circe_s_moonlit_enchanted_hall.png',
    'cave_mouth': 'cyclops_cave_by_the_sea.png', 'lotus': 'lotus_bay_beneath_the_ruins.png', 'deck': 'sunset_aboard_an_ancient_ship.png',
    'ithaca': 'sunset_feast_in_the_ancient_throne_hall.png', 'sirens': 'sunset_over_the_wreckage_coast.png',
    'strait': 'sunset_passage_through_stormy_cliffs.png', 'underworld': 'underworld_river_beneath_ruined_temples.png',
    'cave': 'wide_cinematic_digital_painting_of_a_giant_cave_in.png', 'hades': 'wide_cinematic_fantasy_landscape_scene_of_a_ruine.png',
    'garden': 'wide_cinematic_painterly_illustration_style_fant.png',
}


def split(im, part):
    """Split an image holding two side-by-side figures at its emptiest column."""
    a = np.array(im.getchannel('A')) > 40
    cols = a.sum(0)
    w = im.width
    mid = int(np.argmin(cols[w // 4: 3 * w // 4])) + w // 4
    piece = im.crop((0, 0, mid, im.height)) if part == 0 else im.crop((mid, 0, w, im.height))
    return piece.crop(piece.getbbox())


# Hue shifts (PIL HSV units, 0-255) that recolour one garment so crewmates read apart at a glance.
RECOLOUR = {'elp3': ((115, 160), 70)}  # Elpenor's teal cloak -> green, away from Polites's teal


def recolour(im, key):
    (lo, hi), to = RECOLOUR[key]
    hsv = np.array(im.convert('RGB').convert('HSV')).astype(int)
    m = (hsv[..., 0] > lo) & (hsv[..., 0] < hi) & (hsv[..., 1] > 35)
    hsv[..., 0] = np.where(m, hsv[..., 0] + to - (lo + hi) // 2, hsv[..., 0]) % 256
    out = Image.fromarray(hsv.astype('uint8'), 'HSV').convert('RGBA')
    out.putalpha(im.getchannel('A'))
    return out


def load(src):
    if isinstance(src, tuple):
        return split(Image.open(os.path.join(SL, src[0] + '.png')).convert('RGBA'), src[1])
    im = Image.open(os.path.join(SL, src + '.png')).convert('RGBA')
    key = src.split('_')[0]
    return recolour(im, key) if key in RECOLOUR else im


def save(im, path, max_h=None, max_w=None, q=86):
    if max_h and im.height > max_h:
        im = im.resize((round(im.width * max_h / im.height), max_h), Image.LANCZOS)
    if max_w and im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'WEBP', quality=q, method=6)
    return im.size


import sys
ONLY = set(sys.argv[1:])  # optional: character names to rebuild; sprite-sizes.json is always rewritten in full
sizes = {}
for who, poses in POSES.items():
    for pose, src in poses.items():
        path = os.path.join(OUT, 'cast', f'{who}-{pose}.webp')
        if ONLY and who not in ONLY:
            sizes[f'{who}-{pose}'] = Image.open(path).size
            continue
        sizes[f'{who}-{pose}'] = save(load(src), path, max_h=620)
for who, faces in FACES.items():
    for face, src in faces.items():
        if not ONLY or who in ONLY:
            save(load(src), os.path.join(OUT, 'faces', f'{who}-{face}.webp'), max_h=240)
for name, src in PROPS.items():
    if not ONLY:
        save(load(src), os.path.join(OUT, 'props', f'{name}.webp'), max_h=260, max_w=300)
for name, f in ([] if ONLY else ENVS.items()):
    im = Image.open(os.path.join(ENV, f)).convert('RGB')
    save(im, os.path.join(OUT, 'scenes', f'{name}.webp'), max_w=1600, q=78)
    save(im, os.path.join(OUT, 'scenes', f'{name}-sm.webp'), max_w=800, q=72)
# Sprite aspect ratios let the stage reserve space before images load.
with open(os.path.join(HERE, 'sprite-sizes.json'), 'w') as fh:
    json.dump(sizes, fh)
with open(os.path.join(OUT, '..', 'data', 'sprites.js'), 'w', encoding='utf-8') as fh:
    fh.write('/* Native sprite sizes (px), written by a build step. */\nwindow.ODY = window.ODY || {};\n')
    fh.write('ODY.sprites = ' + json.dumps({k: list(v) for k, v in sorted(sizes.items())}, separators=(',', ':')) + ';\n')
print('done')
