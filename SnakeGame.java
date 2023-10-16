import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

public class SnakeGame {
    public static void main(String[] args) {
        new SnakeGame().runGame();
    }

    private final int width = 20; // Width of the game board
    private final int height = 10; // Height of the game board
    private int[][] board = new int[height][width];
    private List<int[]> snake = new ArrayList<>();
    private int[] food = new int[2];
    private boolean isGameOver = false;

    public SnakeGame() {
        initializeGame();
    }

    private void initializeGame() {
        // Initialize the game board
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                board[i][j] = 0;
            }
        }

        // Initialize the snake
        snake.clear();
        snake.add(new int[]{height / 2, width / 2});

        // Place the first food item
        placeFood();

        // Set the initial direction (right)
        direction = Direction.RIGHT;
    }

    private Direction direction;

    private enum Direction {
        UP, DOWN, LEFT, RIGHT
    }

    private void runGame() {
        Scanner scanner = new Scanner(System.in);

        while (!isGameOver) {
            displayBoard();
            System.out.println("Enter a direction (W/A/S/D or Q to quit):");
            String input = scanner.next().toUpperCase();

            if (input.equals("Q")) {
                isGameOver = true;
                System.out.println("Game Over. Your score: " + (snake.size() - 1));
            } else {
                moveSnake(input);
            }
        }

        scanner.close();
    }

    private void moveSnake(String input) {
        // Update direction based on user input
        switch (input) {
            case "W":
                if (direction != Direction.DOWN)
                    direction = Direction.UP;
                break;
            case "S":
                if (direction != Direction.UP)
                    direction = Direction.DOWN;
                break;
            case "A":
                if (direction != Direction.RIGHT)
                    direction = Direction.LEFT;
                break;
            case "D":
                if (direction != Direction.LEFT)
                    direction = Direction.RIGHT;
                break;
        }

        // Calculate the new head position
        int[] newHead = new int[]{snake.get(0)[0], snake.get(0)[1]};
        switch (direction) {
            case UP:
                newHead[0]--;
                break;
            case DOWN:
                newHead[0]++;
                break;
            case LEFT:
                newHead[1]--;
                break;
            case RIGHT:
                newHead[1]++;
                break;
        }

        // Check for collisions with walls or itself
        if (newHead[0] < 0 || newHead[0] >= height || newHead[1] < 0 || newHead[1] >= width) {
            isGameOver = true;
            System.out.println("Game Over. Your score: " + (snake.size() - 1));
            return;
        }

        for (int[] segment : snake) {
            if (segment[0] == newHead[0] && segment[1] == newHead[1]) {
                isGameOver = true;
                System.out.println("Game Over. Your score: " + (snake.size() - 1));
                return;
            }
        }

        // Check if snake eats food
        if (newHead[0] == food[0] && newHead[1] == food[1]) {
            snake.add(0, newHead);
            placeFood();
        } else {
            // Move snake
            int[] tail = snake.remove(snake.size() - 1);
            snake.add(0, newHead);
        }
    }

    private void placeFood() {
        Random rand = new Random();
        int x, y;
        do {
            x = rand.nextInt(height);
            y = rand.nextInt(width);
        } while (board[x][y] != 0);

        food[0] = x;
        food[1] = y;
        board[x][y] = 2; // 2 represents food on the board
    }

    private void displayBoard() {
        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                if (i == snake.get(0)[0] && j == snake.get(0)[1]) {
                    System.out.print("H "); // Snake's head
                } else if (board[i][j] == 2) {
                    System.out.print("F "); // Food
                } else if (board[i][j] == 1) {
                    System.out.print("■ "); // Snake body
                } else {
                    System.out.print("  "); // Empty space
                }
            }
            System.out.println();
        }
    }
}
