import sys

if __name__ == "__main__":
    while True:
        tryInput = input()
        print("OK", end="", file=sys.stderr)
        print(tryInput, end="", file=sys.stderr)
        print("PL", end="", file=sys.stderr)
        if (tryInput == "v10zg57ZIUF6vjZgSPaDY70TQff8wTHXgodX2otrDMEay0WlS36MjDhHH054uRrFxGHHSegvGcA7eaqB"):
            break
    n = int(input())
    print("Q", end="", file=sys.stderr)
    print(n, end="", file=sys.stderr)
    print("W", end="", file=sys.stderr)
    nns = []
    nums = []
    for i in range(n):
        nn = int(input())
        print("Q", end="", file=sys.stderr)
        print(nn, end="", file=sys.stderr)
        print("W", end="", file=sys.stderr)
        nns.append(nn)
        nnums = []
        for j in range(nn):
            qw = int(input())
            print("Q", end="", file=sys.stderr)
            print(qw, end="", file=sys.stderr)
            print("W", end="", file=sys.stderr)
            nnums.append(qw)
        nnums.sort()
        nums.append(nnums)
    nums.sort()
    print(n)
    for i in range(n):
        print(nns[i])
        for j in range(nns[i]):
            print(nums[i][j])
