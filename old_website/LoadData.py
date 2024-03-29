from fastapi import FastAPI, Response, status, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import serial
from pathlib import Path
import time


# CONSTANTS
BASE_DIR = Path(__file__).resolve().parent
FILEPATH = Path(BASE_DIR, 'recordings')
WAIT_TIME = 30 #wait time in seconds
BAUDRATE = 115200

# global variables
record = True
s = serial.Serial("COM3", BAUDRATE) #serial object
app = FastAPI() # fastAPI object

# setup js and html files
app.mount("/static", StaticFiles(directory=Path(BASE_DIR, 'static')), name="static")
templates = Jinja2Templates(directory=Path(BASE_DIR,'templates'))

# loads page
@app.get("/recording", status_code = 200)
async def load_page(request : Request):
    return templates.TemplateResponse("sound_browser.html", {"request" : request})

# starts recording data and saves it to a txt file in folder recordings
@app.get("/recording/{DBLevel}")
async def print_recording(DBLevel):
    fileName = FILEPATH + str(DBLevel) + "dbtest.txt"

    try:
        s.reset_input_buffer()
        file = open(fileName, "w") 
        print("opened file")   
        start_time = time.time()
        lineBuffer = []
        print("reading from board")
        while(time.time() - start_time < WAIT_TIME):
            if(s.in_waiting > 0):
                line = s.readline()
                lineBuffer.append(line)
        
        print("writing to file...")

        for line in lineBuffer:
            file.write(line.decode('utf-8'))
        print("write finished")
        file.close()
        print("file closed")   
        return {"outcome" : "success"}
        
    except Exception as e:
        print(e)
        return {"outcome" : "failure"}

            
