/* What the learner is asked to write in each step.
   tasks[i] matches the i-th code box of the step, in the order: top of file, main program, bottom of file
   (see projectBoxes in projects.js). hint is one nudge shown on request. */
(function () {
  const TASKS = {
    cs: [
      { tasks: ["Print the title `=== DUNGEON DASH ===` with `Console.WriteLine`."],
        hint: 'A call looks like `Console.WriteLine("text");`. Don\'t forget the semicolon.' },
      { tasks: ['Create `string hero` set to `"Mira"` and `int health` set to `20`. Then print `Mira enters the dungeon with 20 HP.` using an interpolated string built from `{hero}` and `{health}`.'],
        hint: "Start the string with `$` and put the variable names inside `{ }`: `$\"{hero} enters ...\"`." },
      { tasks: ['Write an if/else. If `health > 15`, print `You feel strong.`, otherwise print `You feel shaky.` (use `Console.WriteLine` in both).'],
        hint: "Both branches can be one-liners: `if (...) Console.WriteLine(...);` then `else Console.WriteLine(...);`." },
      { tasks: ["Create `int goblin = 12;`. Loop `int round = 1` while `round <= 3`, adding 1 each pass. Inside the loop braces: make `int damage = round * 2;`, subtract it with `goblin -= damage;`, then print `Round {round}: you hit for {damage}. Goblin HP: {goblin}` as an interpolated string."],
        hint: "`for (int round = 1; round <= 3; round++)` followed by a `{ ... }` block." },
      { tasks: ['Create `var inventory` as a `new List<string>` holding `"Sword"` and `"Potion"`. Then print `Inventory: ` followed by `inventory.Count` and ` items`, using an interpolated string.'],
        hint: 'Initialise the list with braces: `new List<string> { "Sword", "Potion" };`.' },
      { tasks: [
          "Subtract 6 from `health` with `-=` and print `The goblin claws you. HP: {health}`. Then set `health = Heal(health, 8);` and print `You drink a potion. HP: {health}`. Use interpolated strings.",
          "Write the method `static int Heal(int hp, int amount)` using `=>` so it returns `Math.Min(20, hp + amount)`."],
        hint: "An expression-bodied method: `static int Name(int a, int b) => expression;`." },
      { tasks: [
          'Edit the goblin code. Make it `var goblin = new Monster { Name = "Goblin", Hp = 12 };`. In the loop use `goblin.Hp -= damage;` and print `Round {round}: you hit for {damage}. {goblin.Name} HP: {goblin.Hp}`.',
          'Declare `string? drop = null;` then print `Goblin drops: ` followed by `drop ?? "nothing"` using an interpolated string.',
          'Write `class Monster` with two auto-properties: `public string Name { get; set; } = "";` and `public int Hp { get; set; }`.'],
        hint: "Properties use `{ get; set; }`. `??` supplies a fallback when the left side is null." },
      { tasks: ['Create `var loot` as a `new List<(string Name, int Value)>` with `("Coin", 3)`, `("Ruby", 50)` and `("Boots", 12)`. Make `var valuable = loot.Where(l => l.Value > 10).Select(l => l.Name);`. Print `Valuable loot: ` followed by `string.Join(", ", valuable)`.'],
        hint: "Chain the calls: `loot.Where(...).Select(...)`. `Where` filters, `Select` picks the name." },
      { tasks: ['Make `int score = loot.Sum(l => l.Value);`. Then make `string rank` from `score switch { ... }` with arms `>= 60 => "Legend"`, `>= 20 => "Adventurer"` and `_ => "Rookie"`. Print `Score {score}: {rank}`.'],
        hint: 'Arms are separated by commas: `score switch { >= 60 => "Legend", ... }`.' },
      { tasks: ['Wait with `await Task.Delay(500);` then print `Game saved.`'],
        hint: "`Task.Delay` takes milliseconds. Put `await` in front of it." }
    ],
    cpp: [
      { tasks: [
          "Include the header for `std::cout`: `#include <iostream>`.",
          'Print `=== SPACE TRADER ===` with `std::cout <<` and end the line with `"\\n"`.'],
        hint: 'Like this: `std::cout << "text\\n";`. Remember the semicolon.' },
      { tasks: ['Make `int fuel = 100;` and `int credits = 50;`. Print `"Fuel: "`, `fuel`, `", credits: "`, `credits` and `"\\n"` in one `std::cout` chain. On the next line print `"Jumps possible: "`, then `fuel / 30`, then `"\\n"`.'],
        hint: 'Chain with `<<`: `std::cout << "Fuel: " << fuel << ...;`.' },
      { tasks: ['Loop `int jump = 1` while `jump <= 3`, adding 1 each pass. Inside the braces: `fuel -= 30;` then print `"Jump "`, `jump`, `": fuel "`, `fuel`, `"\\n"` in one chain.'],
        hint: "`for (int jump = 1; jump <= 3; jump++) { ... }`" },
      { tasks: [
          "Add `#include <string>` under the iostream line.",
          'Make `std::string ship = "Comet";`, then `ship += " II";`. Print `"Ship: "`, `ship`, `" ("`, `ship.size()`, `" chars)"` and `"\\n"`.'],
        hint: "`+=` appends to a string and `.size()` counts its characters." },
      { tasks: [
          "Add `#include <vector>` under the other includes.",
          'Make `std::vector<std::string> cargo = {"Ore", "Water"};`, then `cargo.push_back("Crystals");`. Print `"Cargo items: "`, `cargo.size()` and `"\\n"`.'],
        hint: "`push_back` adds an item to the end of a vector." },
      { tasks: [
          "Write `void refuel(int& fuel, int amount)` whose body does `fuel += amount;`.",
          'Call `refuel(fuel, 50);` then print `"Refuelled. Fuel: "`, `fuel` and `"\\n"`.'],
        hint: "The `&` after `int` is what makes `fuel` a reference to the caller's variable." },
      { tasks: [
          'Write `void printCargo(const std::vector<std::string>& items)`. Its body is a loop `for (const auto& item : items)` that prints `" - "`, `item` and `"\\n"`.',
          'Print `"Cargo:\\n"`, then call `printCargo(cargo);`.'],
        hint: "A range-based loop reads: `for (const auto& item : items) { ... }`." },
      { tasks: [
          "Add `#include <memory>` under the other includes.",
          "Write `struct Planet` with `std::string name;` and `int price;`. A struct ends with `};`.",
          'Make `auto station = std::make_unique<Planet>(Planet{"Titan", 30});`. Print `"Docked at "`, `station->name`, `" (ore sells for "`, `station->price`, `")"` and `"\\n"`.'],
        hint: "`->` reaches a member through a pointer, like `station->name`." },
      { tasks: ['Make `int price = station->price;`. Create `auto sell` as a lambda that captures `price`, takes `int units` and returns `units * price`. Then `credits += sell(4);` and print `"Sold 4 units. Credits: "`, `credits` and `"\\n"`.'],
        hint: "A lambda looks like `[price](int units) { return ...; };`." },
      { tasks: [
          "Write `template <typename T>` and then `T biggest(T a, T b)` whose body returns `a > b ? a : b;`.",
          'Make `int record = biggest(credits, 150);` and print `"Record credits: "`, `record` and `"\\n"`.'],
        hint: "The conditional operator: `condition ? valueIfTrue : valueIfFalse`." }
    ]
  };
  /* Lessons (challenge ids) a learner must finish before a step unlocks: everything the step's code relies on. */
  const NEEDS = {
    cs: [["cs-b1"], ["cs-b2", "cs-b3"], ["cs-b4"], ["cs-b5"], ["cs-i2"], ["cs-i3"], ["cs-i4", "cs-i5"], ["cs-a1"], ["cs-a1", "cs-a5"], ["cs-a3"]],
    cpp: [["cpp-b1"], ["cpp-b2", "cpp-b3"], ["cpp-b4"], ["cpp-b5"], ["cpp-i2"], ["cpp-i1"], ["cpp-i4"], ["cpp-i3", "cpp-a1"], ["cpp-a5"], ["cpp-a3"]]
  };
  for (const lang of Object.keys(TASKS)) {
    const p = window.PROJECTS[lang];
    if (p) p.steps.forEach((s, i) => Object.assign(s, TASKS[lang][i], { needs: NEEDS[lang][i] }));
  }
})();
