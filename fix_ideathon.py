import cv2
from PIL import Image

def get_orientation(path):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
    
    img = cv2.imread(path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    best_rot = 0
    max_faces = 0
    
    rotations = {
        'Native': gray,
        'CW': cv2.rotate(gray, cv2.ROTATE_90_CLOCKWISE),
        'CCW': cv2.rotate(gray, cv2.ROTATE_90_COUNTERCLOCKWISE)
    }
    
    for r_name, r_img in rotations.items():
        faces = len(face_cascade.detectMultiScale(r_img, 1.1, 4))
        profiles = len(profile_cascade.detectMultiScale(r_img, 1.1, 4))
        score = faces + profiles
        print(f"{path} {r_name}: {score} faces found")
        if score > max_faces:
            max_faces = score
            best_rot = r_name
            
    print(f"--> {path} needs: {best_rot}\n")

get_orientation('public/Docs/IDEATHON1.webp')
get_orientation('public/Docs/IDEATHON5.webp')
