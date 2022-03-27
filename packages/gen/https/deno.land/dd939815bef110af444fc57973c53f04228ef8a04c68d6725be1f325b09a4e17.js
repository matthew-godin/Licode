export class YAMLError extends Error {
    mark;
    constructor(message = "(unknown reason)", mark = "") {
        super(`${message} ${mark}`);
        this.mark = mark;
        this.name = this.constructor.name;
    }
    toString(_compact) {
        return `${this.name}: ${this.message} ${this.mark}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJodHRwczovL2Rlbm8ubGFuZC9zdGRAMC4xMjUuMC9lbmNvZGluZy9feWFtbC9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxNQUFNLE9BQU8sU0FBVSxTQUFRLEtBQUs7SUFHdEI7SUFGWixZQUNFLE9BQU8sR0FBRyxrQkFBa0IsRUFDbEIsT0FBc0IsRUFBRTtRQUVsQyxLQUFLLENBQUMsR0FBRyxPQUFPLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztRQUZsQixTQUFJLEdBQUosSUFBSSxDQUFvQjtRQUdsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBQ3BDLENBQUM7SUFFTSxRQUFRLENBQUMsUUFBaUI7UUFDL0IsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEQsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGZyb20ganMteWFtbCB2My4xMy4xOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuaW1wb3J0IHR5cGUgeyBNYXJrIH0gZnJvbSBcIi4vbWFyay50c1wiO1xuXG5leHBvcnQgY2xhc3MgWUFNTEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBtZXNzYWdlID0gXCIodW5rbm93biByZWFzb24pXCIsXG4gICAgcHJvdGVjdGVkIG1hcms6IE1hcmsgfCBzdHJpbmcgPSBcIlwiLFxuICApIHtcbiAgICBzdXBlcihgJHttZXNzYWdlfSAke21hcmt9YCk7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKF9jb21wYWN0OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5uYW1lfTogJHt0aGlzLm1lc3NhZ2V9ICR7dGhpcy5tYXJrfWA7XG4gIH1cbn1cbiJdfQ==