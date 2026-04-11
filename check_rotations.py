import cv2
import glob
import os

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

def get_face_score(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Equalize histogram for better contrast
    gray = cv2.equalizeHist(gray)
    
    faces_front = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=4, minSize=(30, 30))
    faces_profile = profile_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=4, minSize=(30, 30))
    
    # Flip for left profile
    gray_flip = cv2.flip(gray, 1)
    faces_profile_left = profile_cascade.detectMultiScale(gray_flip, scaleFactor=1.05, minNeighbors=4, minSize=(30, 30))
    
    score = 0
    if len(faces_front) > 0:
        score += sum(w * h for (x, y, w, h) in faces_front)
    if len(faces_profile) > 0:
        score += sum((w * h) * 0.5 for (x, y, w, h) in faces_profile)
    if len(faces_profile_left) > 0:
        score += sum((w * h) * 0.5 for (x, y, w, h) in faces_profile_left)
        
    return score

files = glob.glob('public/Docs/*.webp')
print(f"Checking {len(files)} images...")

rotations_needed = {}

for f in files:
    img = cv2.imread(f)
    if img is None: continue
    
    h, w = img.shape[:2]
    max_dim = max(h, w)
    if max_dim > 800:
        scale = 800 / max_dim
        img = cv2.resize(img, (int(w * scale), int(h * scale)))
    
    score_0 = get_face_score(img)
    score_90 = get_face_score(cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE))
    score_270 = get_face_score(cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE))
    score_180 = get_face_score(cv2.rotate(img, cv2.ROTATE_180))
    
    scores = {
        '': score_0,
        'rotate-90': score_90,  # Means image was imported such that it needs 90CW to be upright
        '-rotate-90': score_270, # Means it needs 90CCW to be upright
        'rotate-180': score_180
    }
    
    best_rot = max(scores, key=scores.get)
    if best_rot != '' and scores[best_rot] > score_0 * 1.5:  # ensure it's significantly better
        filename = os.path.basename(f)
        print(f"[{filename}] Fix Needed: {best_rot} (Score: {scores[best_rot]} vs original {score_0})")
        rotations_needed[filename] = best_rot

print("FINAL JSON DICT TO USE IN JS:")
print(rotations_needed)
