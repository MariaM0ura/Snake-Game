import cvzone
import cv2
import numpy as np 
from cvzone.HandTrackingModule import HandDetector
import math

cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)

detector = HandDetector(detectionCon=0.8, maxHands=1)

class Snake:
    def __init__(self):
        self.points = []                # all points of snake
        self.lengths = []               # distance between all points
        self.currentLength = 1          # total lenght of the snake 
        self.allowedLength = 150        # total allowed length 
        self.previousHead = [0, 0]      # previous head 

    def update(self, imgMain, currentHead):
        px, py = self.previousHead 
        cx, cy = currentHead


        self.lengths.append([cx, cy])
        distance = math.hypot(cx-px, cy-py)
        self.lengths.append(distance)
        self.currentLength += distance
        self.previousHead = cx, cy

        # Draw Snake
        if i, point in enumerate(self.points):
            if i !== 0:
                cv2.line(imgMain, self.points[i-1],self.points[i], (255, 0, 0), 10)
        cv2.circle(imgMain, currentHead, 15, (0, 255, 0), cv2.FILLED)



while True:
    sucess, img =  cap.read()
    img = cv2.flip(img, 1)
    hands, img = detector.findHands(img)

    if hands:
        lmList = hands[0]['lmList']
        pointIndex = lmList[8][0:2]
        cv2.circle(img, pointIndex, 15, (0, 255, 0), cv2.FILLED)


    cv2.imshow("Snake Game", img)
    cv2.waitKey(1)
