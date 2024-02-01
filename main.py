import random
import csv

def main():
    data = []
    with open("input-csv.txt", "r") as file:
        reader = csv.reader(file)
        data = list(reader)  # Load data directly as list of pairs

    random.shuffle(data)  # Shuffle the data
    wrong_answers = []
    num_wrong = 0

    while True:
        choice = input("Enter E to name element abbreviation, N to name their names (or Q to quit): ").upper()
        if choice in ("E", "N", "Q"):
            break
        print("Invalid choice. Please enter E, N, or Q.")

    if choice == "Q":
        return

    for pair in data:
        if choice == "E":
            question = pair[1]
            answer = pair[0]
        else:
            question = pair[0]
            answer = pair[1]

        user_input = input(f"\n{question}: ")
        if user_input != answer:
            print("\nIncorrect ({})\n".format(answer))
            num_wrong += 1
            wrong_answers.append(pair)

    accuracy = (len(data) - num_wrong) / len(data)
    print("\nACCURACY:", accuracy)
    print("WRONG:")
    for pair in wrong_answers:
        print(f"{pair[1]} ({pair[0]})")

if __name__ == "__main__":
    main()