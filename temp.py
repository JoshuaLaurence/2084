#3D Noughts and Crosses

menu = "Noughts and Crosses\n\
1, Two Player\n\
Q, Quit\n\
Choice: "


"""
|        _0____1__2___
|       /   /   /   / 3
|      /___/___/___/
|     / O / X|/ O / 2
|    /___/___|___/
|   / O / X /|O / 1
|  /___/___/_|_/
| / X / O / X|/ 0
|/___/___/___|


|      ______|_____|
|     /  /X /|O/  /
|    /__/__/_|/__/
|   /  /O /X |  /
|  /__/__/__/|_/
| /  /X /  / |/
|/__/__/__/__|

"""

ThreeDBoard = []

def createBoard(board, numberOfBoards):
    for a in range(numberOfBoards):
        board.append([])
        for b in range(numberOfBoards * numberOfBoards):
            board[a].append(" ")

def positionValid(grid, coordinates):
    if len(coordinates) == 3:
        if coordinates[0].isdigit() and coordinates[1].isdigit() and coordinates[2].isdigit():
            if int(coordinates[0]) >= 0 and int(coordinates[0]) <= len(grid) - 1:
                if int(coordinates[1]) >= 0 and int(coordinates[1]) <= len(grid) - 1:
                    if int(coordinates[2]) >= 0 and int(coordinates[2]) <= len(grid) - 1:
                        return True
    return False

def printgrid(grid):
    printlength = len(grid) * 6 + 4
    printheight = len(grid) * 2 + 2
    baseItem = "/___"
    topItem = "/ - "
    numberItem = "  - "
    printingGrid = []
    for c in range(len(grid)):
        currentRow = 0
        for a in range(printheight):
            currentIndex = a + (printheight*c)
            printingGrid.append([])
            if a == printheight:
                break
            elif a == printheight - 1:
                if c != (len(grid) - 1):
                    printingGrid[currentIndex].append("|")
                else:
                    printingGrid[currentIndex].append(" ")
                for b in range(a - 1):
                    printingGrid[currentIndex].append(" ")
                for d in range(len(grid)):
                    numberList = list(numberItem)
                    numberList[2] = str(d)
                    printingGrid[currentIndex].extend(numberList)
                if c != (len(grid) - 1):
                    printingGrid[currentIndex].append("|")

                if c != (len(grid) - 1) and printingGrid[currentIndex][len(grid) * 4] != "X" and printingGrid[currentIndex][len(grid) * 4] != "O":
                    printingGrid[currentIndex][len(grid) * 4] = "|"

            elif a == printheight - 2:
                if c != (len(grid) - 1):
                    printingGrid[currentIndex].append("|")
                else:
                    printingGrid[currentIndex].append(" ")
                for b in range(a):
                    printingGrid[currentIndex].append(" ")
                printinglength = len(printingGrid[currentIndex])
                for e in range(len(numberItem) * len(grid)):
                    printingGrid[currentIndex].append("-")
                if c != 0:
                    printingGrid[currentIndex].append("|")

                if c != (len(grid) - 1) and printingGrid[currentIndex][len(grid) * 4] != "X" and printingGrid[currentIndex][len(grid) * 4] != "O":
                    printingGrid[currentIndex][len(grid) * 4] = "|"

            elif a % 2 != 0  and a != 0:
                if c != (len(grid) - 1):
                    printingGrid[currentIndex].append("|")
                else:
                    printingGrid[currentIndex].append(" ")
                for b in range(a):
                    printingGrid[currentIndex].append(" ")
                for d in range(len(grid)):
                    topList = list(topItem)
                    indexItem = int((len(grid) * ((a - 1) / 2)) + d)
                    topList[2] = grid[c][indexItem]
                    printingGrid[currentIndex].extend(topList)
                printingGrid[currentIndex].append("/")
                printinglength = len(printingGrid[currentIndex])
                for e in range(printlength - printinglength - 3):
                    printingGrid[currentIndex].append(" ")
                if c != 0:
                    printingGrid[currentIndex].append("|")
                printingGrid[currentIndex].append(" ")
                printingGrid[currentIndex].append(str(currentRow))

                if c != (len(grid) - 1) and printingGrid[currentIndex][len(grid) * 4] != "X" and printingGrid[currentIndex][len(grid) * 4] != "O":
                    printingGrid[currentIndex][len(grid) * 4] = "|"
                currentRow += 1

            else:
                if c != (len(grid) - 1):
                    printingGrid[currentIndex].append("|")
                else:
                    printingGrid[currentIndex].append(" ")
                for b in range(a):
                    printingGrid[currentIndex].append(" ")
                for d in range(len(grid)):
                    baseList = list(baseItem)
                    printingGrid[currentIndex].extend(baseList)
                printingGrid[currentIndex].append("/")
                printinglength = len(printingGrid[currentIndex])
                for e in range(printlength - printinglength - 3):
                    printingGrid[currentIndex].append(" ")
                if c != 0:
                    printingGrid[currentIndex].append("|")
                if c != (len(grid) - 1) and printingGrid[currentIndex][len(grid) * 4] != "X" and printingGrid[currentIndex][len(grid) * 4] != "O":
                    printingGrid[currentIndex][len(grid) * 4] = "|"

    for f in reversed(printingGrid):
        print("".join(f))


winningPaths = []
XList = []
OList = []
def createWinningPaths(board):
    global winningPaths
    global XList
    global OList
    winningPaths = []
    XList = ["X"] * len(board)
    OList = ["O"] * len(board)
    for a in range(len(board)):
        columnTuple = ()
        rowTuple = ()
        for b in range(len(board)):
            columnTuple += (b + (a * len(board)),)
            rowTuple += ((b * len(board)) + a,)
        winningPaths.append(columnTuple)
        winningPaths.append(rowTuple)
    positiveDiagonalTuple = ()
    negativeDiagonalTuple = ()
    for c in range(len(board)):
        positiveDiagonalTuple += (c + (len(board) * c),)
        negativeDiagonalTuple += ((len(board) - 1) * c + 3,)
    winningPaths.append(positiveDiagonalTuple)
    winningPaths.append(negativeDiagonalTuple)
    return False

def TwoDProjectionMapping(board, winPaths):
    twodprojection = []
    for a in range(len(board)):
        twodprojection.append(board[a])
    for b in range(int(len(board) + 2)):
        temporaryArray = []
        if b <= len(board) - 1:
            for c in range(len(board)):
                for d in range(len(board)):
                    temporaryArray.append(board[c][d + (len(board) * b)])
            twodprojection.append(temporaryArray)
            temporaryArray = []
            for c in range(len(board)):
                for d in range(len(board)):
                    temporaryArray.append(board[c][(d * len(board)) + b])
            twodprojection.append(temporaryArray)
        elif b == len(board):
            for c in range(len(board)):
                for d in range(len(board)):
                    temporaryArray.append(board[c][winPaths[len(winPaths) - 2][d]])
            twodprojection.append(temporaryArray)
        elif b == len(board) + 1:
            for c in range(len(board)):
                for d in range(len(board)):
                    temporaryArray.append(board[c][winPaths[len(winPaths) - 1][d]])
            twodprojection.append(temporaryArray)
    return twodprojection

def wincheck(twodprojection, winningPaths, xlist, olist):
    for d in twodprojection:
        for a in winningPaths:
            line = [d[b] for b in a]
            if line == xlist:
                print("\n\nX Wins!!!\n\n")
                return True
            elif line == olist:
                print("\n\nO Wins!!!\n\n")
                return True
            else:
                empty = True
                for a in range(len(twodprojection)):
                    if " " in twodprojection[a]:
                        empty = False
                        break
                if empty:
                    print("\n\nDRAW!!!\n\n")
                    return True
    return False

def clear(p1, p2, winpaths, xlist, olist, board):
    return "","", [],[],[],[]

p1Icon = ""
p2Icon = ""
numberOfBoards = 0
def startMatchFiller(board):
    p1 = ""
    p2 = ""
    boardNum = 0
    while True:
        num = str(input("Board Size? (2-10): "))
        if num.isdigit():
            if int(num) >= 2 and int(num) <= 10:
                boardNum =  int(num)
                createBoard(board, boardNum)
                createWinningPaths(board)
                break
        print("Invalid Input")
    while True:
        currentp1 = str(input("Player 1, are you X or O: "))
        if currentp1.lower() == "x" or currentp1.lower() == "o":
            if currentp1.lower() == "x":
                p1 = currentp1.upper()
                p2 = "O"
                printgrid(board)
                break
            else:
                p1 = currentp1.upper()
                p2 = "X"
                printgrid(board)
                break
        print("Invalid Input")
    return p1, p2

def actualGamePlay(board, p1, p2, winningPaths, xlist, olist):
    won = False
    while won == False:
        if won == True: break
        while True:
            p1Coords = str(input("Player 1, choose a position (y,x,z), or type 'q' to quit: "))
            if p1Coords.lower() == "q":
                print("\nQuitting...\n")
                won = True
                break
            if "," in p1Coords:
                allCoords = (p1Coords.split(","))
                allCoords = [i.strip() for i in allCoords]
                positionInBoard = len(board) * int(allCoords[0]) + int(allCoords[1])
                if positionValid(board, allCoords) == True and board[int(allCoords[2])][positionInBoard] == " ":
                    board[int(allCoords[2])][positionInBoard] = p1
                    printgrid(board)
                    twodprojection = TwoDProjectionMapping(board, winningPaths)
                    won = wincheck(twodprojection, winningPaths, xlist, olist)
                    break
        if won == True: break
        while True:
            p2Coords = str(input("Player 2, choose a position (y,x,z), or type 'q' to quit: "))
            if p2Coords.lower() == "q":
                print("\nQuitting...\n")
                won = True
                break
            if "," in p2Coords:
                allCoords = (p2Coords.split(","))
                allCoords = [i.strip() for i in allCoords]
                positionInBoard = len(board) * int(allCoords[0]) + int(allCoords[1])
                if positionValid(board, allCoords) == True and board[int(allCoords[2])][positionInBoard] == " ":
                    board[int(allCoords[2])][positionInBoard] = p2
                    printgrid(board)
                    twodprojection = TwoDProjectionMapping(board, winningPaths)
                    won = wincheck(twodprojection, winningPaths, xlist, olist)
                    break
    p1,p2,winningPaths,xlist,olist,board = clear(p1, p2, winningPaths, xlist, olist, board)

while True:
    z = str(input(menu))
    if z.lower() == "1":
        print("2 Player Mode Activated")
        ThreeDBoard = []
        p1Icon, p2Icon = startMatchFiller(ThreeDBoard)
        actualGamePlay(ThreeDBoard, p1Icon, p2Icon, winningPaths, XList, OList)
    elif z.lower() == "q":
        print("Quitting...")
        exit()
