

import sys

if __name__ == "__main__":
    p0 = int(input())
    print("G", end="", file=sys.stderr)
    print(p0, end="", file=sys.stderr)
    print("H", end="", file=sys.stderr)
    result = primeFactorsLimitedTo3And7(p0)
