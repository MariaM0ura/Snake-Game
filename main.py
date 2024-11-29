import cvzone
import cv2
import numpy as np 
from cvzone.HandTrackingModule import HandDetector
import math
import random

cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)

detector = HandDetector(detectionCon=0.8, maxHands=1)

class Snake:
    def __init__(self, pathFood):
        self.points = []                # all points of snake
        self.lengths = []               # distance between all points
        self.currentLength = 1          # total lenght of the snake 
        self.allowedLength = 150        # total allowed length 
        self.previousHead = [0, 0]      # previous head 

        #self.imgFood = cv2.imread(pathFood, cv2.IMREAD_UNCHANGED)
        self.imgFood = pathFood
        self.imgFood = cv2.resize(self.imgFood, (80,80))
        self.hFood, self.wFood, _ = self.imgFood.shape
        self.foodPoint = [0, 0]
        self.randomFoodLocation()

        self.score = 0
        self.gamerOver = False


    def randomFoodLocation(self):
        self.foodPoint = random.randint(100, 1000), random.randint(100, 600)



    def update(self, imgMain, currentHead):
        if self.gamerOver:
            imgMain[:] = (30, 30, 30)  
            overlay = imgMain.copy()
            cv2.rectangle(overlay, (150, 350), (850, 600), (0, 0, 255), -1)  # Retângulo vermelho
            alpha = 0.6  
            cv2.addWeighted(overlay, alpha, imgMain, 1 - alpha, 0, imgMain)

            text = "Game Over"
            score_text = f"Score: {self.score}"
            
            cv2.putText(imgMain, text, (180, 450), cv2.FONT_HERSHEY_COMPLEX, 5, (0, 0, 0), 10)
            cv2.putText(imgMain, text, (180, 450), cv2.FONT_HERSHEY_COMPLEX, 5, (255, 255, 255), 6)

            cv2.putText(imgMain, score_text, (280, 550), cv2.FONT_HERSHEY_COMPLEX, 2, (0, 0, 0), 6)
            cv2.putText(imgMain, score_text, (280, 550), cv2.FONT_HERSHEY_COMPLEX, 2, (255, 255, 255), 4)

            restart_text = "Press SPACE or ENTER to Restart"
            cv2.putText(imgMain, restart_text, (180, 650), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

        else:
            px, py = self.previousHead 
            cx, cy = currentHead


            self.points.append([cx, cy])
            distance = math.hypot(cx-px, cy-py)
            self.lengths.append(distance)
            self.currentLength += distance
            self.previousHead = cx, cy


            # Lenght Reduction
            if self.currentLength > self.allowedLength:
                for i, length in enumerate(self.lengths):
                    self.currentLength -= length    
                    self.lengths.pop(i)
                    self.points.pop(i)
                    if self.currentLength <= self.allowedLength:
                        break

            # Draw Snake
            if self.points:
                for i, point in enumerate(self.points):
                    if i != 0:
                        cv2.line(imgMain, self.points[i-1], self.points[i], (51, 196, 164), 20)
                cv2.circle(imgMain, self.points[-1], 15, (51, 196, 164), cv2.FILLED)



            # Draw Food
            rx, ry = self.foodPoint
            imgMain = cvzone.overlayPNG(imgMain, self.imgFood, [rx - self.wFood//2, ry - self.hFood//2])
            cv2.putText(imgMain, f"Score: {self.score}", (50, 80), cv2.FONT_HERSHEY_COMPLEX, 2, (0, 0, 255), 4)


            # Check if snake eats the food
            rx, ry = self.foodPoint
            if rx - self.wFood//2 < cx < rx + self.wFood//2 and ry - self.hFood//2 < cy < ry + self.hFood//2:
                self.randomFoodLocation()
                self.allowedLength += 50
                self.score += 1
                print("Score:", self.score)

            # Check the Collision
            pts = np.array(self.points[:-2], np.int32)
            pts = pts.reshape((-1, 1, 2))
            cv2.polylines(imgMain, [pts], False, (51, 196, 164), thickness=3)
            minDistance = cv2.pointPolygonTest(pts, (cx, cy), True)

            if -1 <= minDistance <= 1:
                print("Collision")
                self.gamerOver = True
                self.points = []
                self.lengths = []
                self.currentLength = 1
                self.previousHead = [0, 0]
                self.allowedLength = 150
                self.randomFoodLocation()
        

        return imgMain



marker_img = cv2.imread("src/public/snake.png", cv2.IMREAD_UNCHANGED)
marker_img = cv2.resize(marker_img, (60, 60))
marker_height, marker_width, _ = marker_img.shape

apple_img = cv2.imread("src/public/apple.png", cv2.IMREAD_UNCHANGED)

game = Snake(apple_img)

while True:
    sucess, img =  cap.read()
    img = cv2.flip(img, 1)
    hands, img = detector.findHands(img)

    if hands:
        lmList = hands[0]['lmList']
        pointIndex = lmList[8][0:2]

        img = game.update(img, pointIndex)
        x, y = pointIndex
        y1, y2 = max(0, y - marker_height // 2), min(img.shape[0], y + marker_height // 2)
        x1, x2 = max(0, x - marker_width // 2), min(img.shape[1], x + marker_width // 2)

        marker_resized = cv2.resize(marker_img, (x2 - x1, y2 - y1))

        alpha_marker = marker_resized[:, :, 3] / 255.0
        for c in range(3):
            img[y1:y2, x1:x2, c] = (
                img[y1:y2, x1:x2, c] * (1 - alpha_marker) + marker_resized[:, :, c] * alpha_marker
            )
        
    cv2.imshow("Snake Game", img)
    key = cv2.waitKey(1)
    if key == 32 or key == 13:
        game.gamerOver = False
        game.score = 0

