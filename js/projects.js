/* Guided build projects.
   A project is made of `parts` (pieces of the program) and `steps`.
   Each part has versions [[sinceStep, code], ...]; the latest version at or below the current step is used.
   `tail` parts go at the bottom of the file (functions, classes). `needs` is the challenge that unlocks a step.
   `out` is only the NEW console output that step adds; the runner joins the outputs of all steps so far. */
window.PROJECTS = {
  cs: {
    title: "Dungeon Dash",
    file: "Program.cs",
    run: "dotnet run",
    intro: "Build a tiny dungeon crawler. Finish a challenge to unlock the next piece, add it, and watch the game run.",
    parts: [
      [[1, `Console.WriteLine("=== DUNGEON DASH ===");`]],
      [[2, `string hero = "Mira";
int health = 20;
Console.WriteLine($"{hero} enters the dungeon with {health} HP.");`]],
      [[3, `if (health > 15) Console.WriteLine("You feel strong.");
else Console.WriteLine("You feel shaky.");`]],
      [[4, `int goblin = 12;
for (int round = 1; round <= 3; round++)
{
    int damage = round * 2;
    goblin -= damage;
    Console.WriteLine($"Round {round}: you hit for {damage}. Goblin HP: {goblin}");
}`], [7, `var goblin = new Monster { Name = "Goblin", Hp = 12 };
for (int round = 1; round <= 3; round++)
{
    int damage = round * 2;
    goblin.Hp -= damage;
    Console.WriteLine($"Round {round}: you hit for {damage}. {goblin.Name} HP: {goblin.Hp}");
}`]],
      [[5, `var inventory = new List<string> { "Sword", "Potion" };
Console.WriteLine($"Inventory: {inventory.Count} items");`]],
      [[6, `health -= 6;
Console.WriteLine($"The goblin claws you. HP: {health}");
health = Heal(health, 8);
Console.WriteLine($"You drink a potion. HP: {health}");`]],
      [[7, `string? drop = null;
Console.WriteLine($"Goblin drops: {drop ?? "nothing"}");`]],
      [[8, `var loot = new List<(string Name, int Value)> { ("Coin", 3), ("Ruby", 50), ("Boots", 12) };
var valuable = loot.Where(l => l.Value > 10).Select(l => l.Name);
Console.WriteLine($"Valuable loot: {string.Join(", ", valuable)}");`]],
      [[9, `int score = loot.Sum(l => l.Value);
string rank = score switch { >= 60 => "Legend", >= 20 => "Adventurer", _ => "Rookie" };
Console.WriteLine($"Score {score}: {rank}");`]],
      [[10, `await Task.Delay(500);
Console.WriteLine("Game saved.");`]]
    ],
    tail: [
      [[6, `static int Heal(int hp, int amount) => Math.Min(20, hp + amount);`]],
      [[7, `class Monster
{
    public string Name { get; set; } = "";
    public int Hp { get; set; }
}`]]
    ],
    steps: [
      { title: "Print the title", needs: "cs-b1",
        explain: "Every program starts somewhere. `Console.WriteLine` shows the game's title. Modern C# lets you write statements directly in the file, with no `Main` method needed.",
        out: ["=== DUNGEON DASH ==="] },
      { title: "Meet the hero", needs: "cs-b3",
        explain: "Two variables hold the hero's name and health. String interpolation (`$\"...{x}...\"`) drops them into the message.",
        out: ["Mira enters the dungeon with 20 HP."] },
      { title: "Check the hero's health", needs: "cs-b4",
        explain: "An `if / else` makes the game react to the state of the hero. Change `health` to 10 and the message flips.",
        out: ["You feel strong."] },
      { title: "First fight", needs: "cs-b5",
        explain: "A `for` loop plays three rounds. Each round the damage grows (`round * 2`) and the goblin's HP drops to 0.",
        out: ["Round 1: you hit for 2. Goblin HP: 10", "Round 2: you hit for 4. Goblin HP: 6", "Round 3: you hit for 6. Goblin HP: 0"] },
      { title: "Pack an inventory", needs: "cs-i2",
        explain: "A `List<string>` holds items and grows as needed. `Count` tells you how many you carry.",
        out: ["Inventory: 2 items"] },
      { title: "Heal with a method", needs: "cs-i3",
        explain: "`Heal` takes health and an amount, then returns the new health, capped at 20 by `Math.Min`. A method with a return type must return a value.",
        out: ["The goblin claws you. HP: 14", "You drink a potion. HP: 20"] },
      { title: "Monsters and loot drops", needs: "cs-i5",
        explain: "The goblin becomes a `Monster` class with properties, so it carries its own name and HP. The loot drop is `string?` (may be null) and `??` supplies a fallback.",
        out: ["Goblin drops: nothing"] },
      { title: "Sort the loot with LINQ", needs: "cs-a1",
        explain: "`Where` keeps loot worth more than 10 and `Select` pulls out the names. `string.Join` glues them into one line.",
        out: ["Valuable loot: Ruby, Boots"] },
      { title: "Rank your score", needs: "cs-a5",
        explain: "`Sum` totals the loot (3 + 50 + 12 = 65). A switch expression turns the score into a rank, checking the highest threshold first.",
        out: ["Score 65: Legend"] },
      { title: "Save the game", needs: "cs-a3",
        explain: "`await Task.Delay` stands in for slow work like writing a save file. The program waits without blocking a thread.",
        out: ["Game saved."] }
    ]
  },
  cpp: {
    title: "Space Trader",
    file: "main.cpp",
    run: "g++ main.cpp -o trader && ./trader",
    intro: "Fly a cargo ship between planets, manage fuel and goods, and cash in. Finish a challenge to unlock each piece.",
    /* `head` goes above main() (includes, structs, functions); `parts` go inside main(); `wrap` is main's frame */
    wrap: ["int main() {", "    return 0;\n}"],
    head: [
      [[1, `#include <iostream>`], [4, `#include <iostream>
#include <string>`], [5, `#include <iostream>
#include <string>
#include <vector>`], [8, `#include <iostream>
#include <string>
#include <vector>
#include <memory>`]],
      [[8, `struct Planet {
    std::string name;
    int price;
};`]],
      [[6, `void refuel(int& fuel, int amount) {
    fuel += amount;
}`]],
      [[7, `void printCargo(const std::vector<std::string>& items) {
    for (const auto& item : items) {
        std::cout << " - " << item << "\\n";
    }
}`]],
      [[10, `template <typename T>
T biggest(T a, T b) {
    return a > b ? a : b;
}`]]
    ],
    parts: [
      [[1, `std::cout << "=== SPACE TRADER ===\\n";`]],
      [[2, `int fuel = 100;
int credits = 50;
std::cout << "Fuel: " << fuel << ", credits: " << credits << "\\n";
std::cout << "Jumps possible: " << fuel / 30 << "\\n";`]],
      [[3, `for (int jump = 1; jump <= 3; jump++) {
    fuel -= 30;
    std::cout << "Jump " << jump << ": fuel " << fuel << "\\n";
}`]],
      [[4, `std::string ship = "Comet";
ship += " II";
std::cout << "Ship: " << ship << " (" << ship.size() << " chars)\\n";`]],
      [[5, `std::vector<std::string> cargo = {"Ore", "Water"};
cargo.push_back("Crystals");
std::cout << "Cargo items: " << cargo.size() << "\\n";`]],
      [[6, `refuel(fuel, 50);
std::cout << "Refuelled. Fuel: " << fuel << "\\n";`]],
      [[7, `std::cout << "Cargo:\\n";
printCargo(cargo);`]],
      [[8, `auto station = std::make_unique<Planet>(Planet{"Titan", 30});
std::cout << "Docked at " << station->name << " (ore sells for " << station->price << ")\\n";`]],
      [[9, `int price = station->price;
auto sell = [price](int units) { return units * price; };
credits += sell(4);
std::cout << "Sold 4 units. Credits: " << credits << "\\n";`]],
      [[10, `int record = biggest(credits, 150);
std::cout << "Record credits: " << record << "\\n";`]]
    ],
    tail: [],
    steps: [
      { title: "Launch the program", needs: "cpp-b1",
        explain: "`#include <iostream>` brings in `std::cout`. Everything you run lives inside `main()`, and the `\\n` at the end of the text starts a new line.",
        out: ["=== SPACE TRADER ==="] },
      { title: "Fuel and credits", needs: "cpp-b3",
        explain: "Two `int` variables track the ship. `fuel / 30` is integer division, so 100 / 30 gives 3 whole jumps with the fraction thrown away.",
        out: ["Fuel: 100, credits: 50", "Jumps possible: 3"] },
      { title: "Fly three jumps", needs: "cpp-b4",
        explain: "A `for` loop burns 30 fuel per jump and prints each result. Note the `\"\\n\"` after every line, since `cout` doesn't add one for you.",
        out: ["Jump 1: fuel 70", "Jump 2: fuel 40", "Jump 3: fuel 10"] },
      { title: "Name the ship", needs: "cpp-b5",
        explain: "`std::string` needs `#include <string>`. `+=` appends text and `.size()` counts the characters in \"Comet II\".",
        out: ["Ship: Comet II (8 chars)"] },
      { title: "Load the cargo hold", needs: "cpp-i2",
        explain: "A `std::vector` is a resizable list. `push_back` adds Crystals to the end, so the hold has 3 items.",
        out: ["Cargo items: 3"] },
      { title: "Refuel with a reference", needs: "cpp-i1",
        explain: "`refuel` takes `int& fuel`, a reference to your own variable. Without the `&` it would change a copy and your fuel would stay at 10.",
        out: ["Refuelled. Fuel: 60"] },
      { title: "Print the cargo list", needs: "cpp-i4",
        explain: "`printCargo` takes `const std::vector<std::string>&`: no copy of the list, and it promises not to change it. The `for (const auto& item : items)` loop visits each item.",
        out: ["Cargo:", " - Ore", " - Water", " - Crystals"] },
      { title: "Dock at a planet", needs: "cpp-a1",
        explain: "`std::make_unique<Planet>` creates the planet on the heap with a single owner, and frees it automatically. `->` reaches the members through the smart pointer.",
        out: ["Docked at Titan (ore sells for 30)"] },
      { title: "Sell with a lambda", needs: "cpp-a5",
        explain: "The lambda `[price](int units) {...}` captures a copy of `price` when it is created, then multiplies units by it. 4 units at 30 earns 120, so credits go from 50 to 170.",
        out: ["Sold 4 units. Credits: 170"] },
      { title: "Track your record", needs: "cpp-a3",
        explain: "`biggest` is a template: it works for any type, and `T` is deduced as `int` because both arguments are `int`. Mixing `int` and `double` here would not compile.",
        out: ["Record credits: 170"] }
    ]
  }
};

/* Full program text after `n` steps have been added. */
window.projectCode = function (p, n) {
  const pick = (versions) => {
    let v = null;
    for (const [since, text] of versions) if (since <= n) v = text;
    return v;
  };
  const body = p.parts.map(pick).filter(Boolean);
  const tail = (p.tail || []).map(pick).filter(Boolean);
  if (!p.wrap) return body.join("\n\n") + (tail.length ? "\n\n" + tail.join("\n\n") : "");
  // Languages that need a main() frame: head (includes, functions), then indented body
  const head = (p.head || []).map(pick).filter(Boolean);
  const indented = body.join("\n\n").split("\n").map((l) => (l ? "    " + l : l)).join("\n");
  return head.join("\n\n") + "\n\n" + p.wrap[0] + "\n" + indented + "\n" + p.wrap[1];
};

/* Console output after `n` steps. */
window.projectOutput = function (p, n) {
  return p.steps.slice(0, n).flatMap((s) => s.out);
};
