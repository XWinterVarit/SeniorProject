

import numpy as np

"""
Write a program that prints the numbers from 1 to 20. But for multiples of three, print 'Fizz'
instead of the number and for the multiples of five print 'Buzz'.
For numbers which are multiples of both three and five print 'FizzBuzz'.
"""
"""
import sys
import time
import requests


def sent():
    for x in range(0,3):
        time.sleep(1)
        sss()


def sss():
    print("senting")
    url = "http://localhost:50001/pythontest"
    # files = {'media': open('test.jpg', 'rb')}
    files = {'file': ("foo.png", open("./test.jpg", 'br'), 'image/jpg')}
    ses = requests.session()
    res = ses.post(url, files=files)



if __name__ == '__main__':
    sss()
"""



import sys
import requests
import cv2
import time
import os

print("python current working directory path: ")
os.chdir(os.path.dirname(__file__))
currentdir_path = os.getcwd()
print(os.getcwd())
print("python version: ")
print(sys.version)
sys.stdout.flush()

cap = cv2.VideoCapture(0)


def HTMLSENTFRAME(framebuffer):
    try:
        url = "http://localhost:50001/pythontest"
        # files = {'media': open('test.jpg', 'rb')}
        files = {'file': ("frame", framebuffer, 'image/jpg')}
        ses = requests.session()
        res = ses.post(url, files=files)
    except:
        print("sent error, destination client not open")
        sys.stdout.flush()



face_cascade = cv2.CascadeClassifier(currentdir_path+'/haarcascade_frontalface_default.xml')
changesectionframecount = 0
posXofMax = 0
posYofMax = 0
widthofMax = 100
heightofMax = 100

while(True):
    # Capture frame-by-frame
    try:
        ret, frame = cap.read()
        # print(frame.shape)
        # time.sleep(0.5)
        # Our operations on the frame come here
        frame = cv2.resize(frame, (0, 0), fx=0.3, fy=0.3)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # Display the resulting frame
        # cv2.imencode(ext, img[, params]) → retval, buf

        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        # print('Faces found: ', len(faces))
        if len(faces) == 0:
            print("no face founded")
        else:
            maxArea = 0

            if changesectionframecount > 1000000:
                changesectionframecount == 0
            changesectionframecount += 1

            for (x, y, w, h) in faces:
                newArea = w * h
                if changesectionframecount % 10 == 0:
                    if newArea > maxArea:
                        maxArea = newArea
                        posXofMax = x
                        posYofMax = y
                        widthofMax = w
                        heightofMax = h

            if changesectionframecount % 10 == 0:
                widthofMax = heightofMax
                posXofMax -= 50
                posYofMax -= 50
                heightofMax += 70
                widthofMax += 70

                if posXofMax < 0:
                    posXofMax = 0
                if posYofMax < 0:
                    posYofMax = 0

            if posYofMax + heightofMax > frame.shape[0]:
                heightofMax = frame.shape[0] - posYofMax
            if posXofMax + widthofMax > frame.shape[1]:
                widthofMax = frame.shape[1] - posXofMax

            crop_img = frame[posYofMax:posYofMax + heightofMax, posXofMax:posXofMax + widthofMax]
            # cv2.imshow('frame', crop_img)
            jpg = cv2.imencode(".jpg", crop_img)[1].tostring()
            HTMLSENTFRAME(jpg)
    except:
        print("frame operation error, skipped")
        sys.stdout.flush()


    # cv2.imwrite("well.jpg", jpg)
    # with open('well.jpg', 'bw') as file:
    #     file.write(jpg)
    # print("pass")
    time.sleep(0.1)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
