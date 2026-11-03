/* Walkthroughs shown after a project step is added.
   how: [code fragment, what it does]; why: why the console shows what it shows.
   Index i here matches steps[i] in projects.js. */
(function () {
  const DOCS = {
    cs: [
      { how: [
          ['Console.WriteLine("...")', "Calls the `WriteLine` method of the `Console` class and passes it the text in quotes (a string literal)."],
          [";", "Every C# statement ends with a semicolon."],
          ["no class, no Main", "Modern C# treats this file as the entry point and runs the statements top to bottom."]],
        why: "The program ran that one line and printed the text, then moved to a new line ready for the next output." },
      { how: [
          ['string hero = "Mira";', "Creates a text variable called `hero` holding Mira."],
          ["int health = 20;", "Creates a whole-number variable called `health`."],
          ['$"{hero} enters ... {health} HP."', "The `$` switches on interpolation: C# swaps each `{name}` for that variable's current value before printing."]],
        why: "`hero` held Mira and `health` held 20, so the two placeholders turned into those values." },
      { how: [
          ["if (health > 15)", "Evaluates the comparison. 20 > 15 is true, so the statement right after it runs."],
          ["else", "Only runs when the condition is false. Here it was skipped."]],
        why: "Health is 20, which is above 15, so only \"You feel strong.\" printed. Change `health` to 10 and the `else` line would print instead." },
      { how: [
          ["int goblin = 12;", "The goblin's hit points."],
          ["for (int round = 1; round <= 3; round++)", "Start `round` at 1, repeat while it is 3 or less, add 1 after each pass. That is three passes."],
          ["int damage = round * 2;", "Declared inside the loop, so it is recalculated each round: 2, 4, then 6."],
          ["goblin -= damage;", "Shorthand for `goblin = goblin - damage`."]],
        why: "12 minus 2 is 10, minus 4 is 6, minus 6 is 0. The loop body printed one line per pass." },
      { how: [
          ['new List<string> { "Sword", "Potion" }', "Creates a list that holds strings and starts it with two items."],
          ["var", "Lets the compiler work out the type (`List<string>`) from the right-hand side."],
          ["inventory.Count", "The number of items currently in the list."]],
        why: "Two items went in, so `Count` is 2." },
      { how: [
          ["static int Heal(int hp, int amount)", "A method that takes two ints and promises to give back an int."],
          ["Math.Min(20, hp + amount)", "Returns the smaller of the two values, which stops health rising above 20."],
          ["health = Heal(health, 8);", "Sends the current health in and stores the returned value back into `health`."],
          ["health -= 6;", "The goblin's attack, taking health from 20 to 14."]],
        why: "14 + 8 would be 22, but `Math.Min` capped it at 20, which is what printed." },
      { how: [
          ["class Monster { ... }", "A blueprint for monster objects. Each one gets its own Name and Hp."],
          ["{ get; set; }", "An auto-property. C# creates the hidden field for you and lets code read and write it."],
          ['new Monster { Name = "Goblin", Hp = 12 }', "Creates one monster and fills in its properties."],
          ["goblin.Hp -= damage;", "The fight now changes the Hp property of the goblin object."],
          ["string? drop = null;", "The `?` says this string is allowed to be null, meaning no value."],
          ['drop ?? "nothing"', "If `drop` is null, use \"nothing\" instead."]],
        why: "The battle prints exactly as before, but the data now lives inside an object. `drop` is null, so the fallback text printed instead of crashing." },
      { how: [
          ["new List<(string Name, int Value)>", "A list of tuples. Each item holds a name and a value together."],
          ["loot.Where(l => l.Value > 10)", "Keeps only the items for which the lambda returns true. `l` stands for one loot item."],
          [".Select(l => l.Name)", "Turns each remaining item into just its name."],
          ['string.Join(", ", valuable)', "Glues the names into one string with commas between them."]],
        why: "Coin (3) fails the test. Ruby (50) and Boots (12) pass, so those two names are joined." },
      { how: [
          ["loot.Sum(l => l.Value)", "Adds up the `Value` of every item: 3 + 50 + 12."],
          ["score switch { ... }", "Checks the arms from top to bottom and returns the result of the first one that matches."],
          ['>= 60 => "Legend"', "A relational pattern that matches any score of 60 or more."],
          ["_ =>", "The catch-all that matches when nothing above did."]],
        why: "The score is 65, which is at least 60, so the first arm wins and `rank` becomes Legend." },
      { how: [
          ["await Task.Delay(500)", "Waits half a second without freezing the program's thread. It stands in for slow work like writing a file."],
          ["await", "Pauses here and resumes when the delay finishes. Top-level statements are allowed to use it directly."]],
        why: "You'd see a short pause, then \"Game saved.\" appear. Real code would write the save file at that point." }
    ],
    cpp: [
      { how: [
          ["#include <iostream>", "Pulls in the declarations for `std::cout`."],
          ["int main()", "The function the operating system starts your program in."],
          ['std::cout << "..."', "`<<` pushes the text into the output stream. `std::` says `cout` lives in the standard library."],
          ["\\n", "The newline character. `cout` doesn't add one for you."]],
        why: "`main` ran, `cout` wrote the text, and the newline moved to the next line. Without it the next output would stick to the end of this one." },
      { how: [
          ["int fuel = 100;", "A whole-number variable for the ship's fuel."],
          ['cout << "Fuel: " << fuel << ...', "Chain `<<` to print text and variables one after another."],
          ["fuel / 30", "Both sides are `int`, so C++ does integer division and discards the remainder."]],
        why: "100 / 30 is 3.33, but an `int` can't hold the .33, so the answer is 3." },
      { how: [
          ["for (int jump = 1; jump <= 3; jump++)", "Runs three times with `jump` set to 1, 2, then 3."],
          ["fuel -= 30;", "Subtracts 30 from fuel on every pass."],
          ['"Jump " << jump << ": fuel " << fuel', "Mixes text and variables in a single line of output."]],
        why: "100 minus 30 is 70, then 40, then 10. Each pass printed one line." },
      { how: [
          ["#include <string>", "Needed for `std::string`."],
          ['std::string ship = "Comet";', "Creates a text variable."],
          ['ship += " II";', "Appends text to the end of the string."],
          ["ship.size()", "The number of characters, including the space."]],
        why: "\"Comet II\" is C-o-m-e-t, a space, then I-I: 8 characters." },
      { how: [
          ["std::vector<std::string> cargo = {...}", "A resizable array of strings that starts with two items."],
          ['cargo.push_back("Crystals")', "Adds an item to the end, so the vector grows."],
          ["cargo.size()", "The current number of items."]],
        why: "Two items to start plus one added makes 3." },
      { how: [
          ["void refuel(int& fuel, int amount)", "The `&` makes `fuel` a reference: another name for the caller's variable, not a copy."],
          ["fuel += amount;", "Changes the original variable through that alias."],
          ["refuel(fuel, 50);", "Passes your own `fuel` variable. Nothing is returned because the change happens in place."]],
        why: "Fuel was 10 after the jumps. The function added 50 straight onto your variable, giving 60. Without the `&` it would have changed a copy and you'd still see 10." },
      { how: [
          ["const std::vector<std::string>& items", "A const reference: no copy of the list, and the function can't modify it."],
          ["for (const auto& item : items)", "A range-based loop that visits every element in order. `auto` lets the compiler pick the type and `&` avoids copying each string."],
          ["printCargo(cargo);", "Calls the function with your list."]],
        why: "The function walked the vector from first to last and printed each name after a dash." },
      { how: [
          ["struct Planet { ... }", "A simple bundle of data: a name and a price."],
          ["std::make_unique<Planet>(...)", "Creates a Planet on the heap and hands you a `unique_ptr` that owns it."],
          ["station->name", "`->` reaches a member through a pointer. It is shorthand for `(*station).name`."],
          ["#include <memory>", "The header where smart pointers live."]],
        why: "The planet lives on the heap. When `station` goes out of scope at the end of `main`, it is deleted automatically. No `delete` needed." },
      { how: [
          ["int price = station->price;", "Copies the price (30) into a plain variable."],
          ["[price](int units) { ... }", "A lambda, which is an unnamed function. `[price]` copies `price` into it when it is created, and `(int units)` is its parameter."],
          ["auto sell", "Stores the lambda. `auto` lets the compiler work out its type."],
          ["credits += sell(4);", "Calls the lambda with 4, gets 120 back, and adds it to credits."]],
        why: "4 x 30 is 120, and 50 + 120 is 170. The lambda keeps its own copy of `price`, so changing `price` later would not affect it." },
      { how: [
          ["template <typename T>", "Declares `T` as a placeholder for any type."],
          ["T biggest(T a, T b)", "Takes two values of the same type and returns that type."],
          ["a > b ? a : b", "The conditional operator: gives `a` if `a > b`, otherwise `b`."],
          ["biggest(credits, 150)", "Both arguments are `int`, so the compiler writes an `int` version for you (T = int)."]],
        why: "170 is bigger than 150, so 170 comes back. Passing an `int` and a `double` together would fail, because `T` can't be both." }
    ]
  };
  for (const lang of Object.keys(DOCS)) {
    const p = window.PROJECTS[lang];
    if (p) p.steps.forEach((s, i) => Object.assign(s, DOCS[lang][i]));
  }
})();
