/* Challenge content. Order within a language = learning path.
   type "choice": opts = [[text, why-wrong-or-right]], ans = index of the correct option
   type "type":   answers = accepted strings, wrong = [[regex, tip]], miss = fallback tip */
window.LEVELS = ["beginner", "intermediate", "advanced"];

window.CHALLENGES = [
/* ============================ C# : BEGINNER ============================ */
{
  id: "cs-b1", lang: "cs", level: "beginner", title: "Hello, console",
  learn: ["Every C# program talks to the screen through the `Console` class. `Console.WriteLine` prints text and moves to a new line. `Console.Write` prints without the new line."],
  lcode: 'Console.WriteLine("Hi!");\nConsole.Write("Same ");\nConsole.Write("line");',
  q: "Fill the blank so the program prints the text followed by a new line.",
  code: 'Console.___("Hello, world!");',
  type: "type", answers: ["WriteLine"],
  wrong: [
    ["^writeline$", "C# is case-sensitive. It must be `WriteLine` with a capital W and a capital L."],
    ["^print(ln)?$", "`print` and `println` belong to Python and Java. C# calls it `WriteLine`."],
    ["^write$", "`Write` prints, but stays on the same line. You need the version that ends the line."]
  ],
  miss: "Think of the method name as 'write a line'.",
  hint: "Two words squashed together, both capitalised.",
  explain: "`Console.WriteLine` prints the text and then a newline.",
  trick: "Case matters everywhere in C#. If the compiler says a name 'does not exist', check capital letters first."
},
{
  id: "cs-b2", lang: "cs", level: "beginner", title: "Variables and types",
  learn: ["A variable needs a type, a name and (usually) a value. Common types: `int` (whole numbers), `double` (decimals), `string` (text), `bool` (true/false)."],
  lcode: 'int age = 25;\ndouble price = 9.99;\nstring name = "Sam";\nbool isOn = true;',
  q: "Which line correctly declares a whole-number variable?",
  type: "choice", ans: 0,
  opts: [
    ["int age = 25;", "Correct. Type, name, value, semicolon."],
    ["integer age = 25;", "There is no `integer` type in C#. The keyword is `int`."],
    ["age = int 25;", "The type goes first, before the name."],
    ['int age = "25";', "Quotes make it a string. An `int` can't hold text, so this will not compile."]
  ],
  explain: "Type first, then name, then `=` and the value.",
  trick: "Use `var` when the type is obvious from the right side: `var age = 25;` is still an `int`, fixed at compile time."
},
{
  id: "cs-b3", lang: "cs", level: "beginner", title: "String interpolation",
  learn: ["Put `$` before a string and you can drop variables straight inside `{ }`. It is cleaner than joining strings with `+`."],
  lcode: 'string who = "Ada";\nConsole.WriteLine($"Hello {who}!");   // Hello Ada!',
  q: "What does this print? Type the exact output.",
  code: 'string n = "Sam";\nConsole.WriteLine($"Hi {n}!");',
  type: "type", answers: ["Hi Sam!"],
  wrong: [
    ["\\{n\\}", "The braces were replaced by the value of `n`. They don't print."],
    ["^hi sam!?$", "Close. Check the capital letters and the exclamation mark."]
  ],
  miss: "Replace `{n}` with the value stored in `n`.",
  hint: "n holds Sam.",
  explain: "`{n}` is swapped for the value of n, so you get `Hi Sam!`.",
  trick: "Forget the `$` and C# prints `{n}` literally. A common first-week bug."
},
{
  id: "cs-b4", lang: "cs", level: "beginner", title: "if / else",
  learn: ["`if` runs code when a condition is true; `else` runs otherwise. The `%` (modulo) operator gives the remainder after division. `x % 2 == 0` means 'x is even'."],
  lcode: "int x = 4;\nif (x % 2 == 0) Console.WriteLine(\"even\");\nelse Console.WriteLine(\"odd\");",
  q: "What does this print?",
  code: 'int x = 7;\nif (x % 2 == 0) Console.WriteLine("even");\nelse Console.WriteLine("odd");',
  type: "type", answers: ["odd"],
  wrong: [["^even$", "7 divided by 2 leaves remainder 1, not 0, so the condition is false and `else` runs."]],
  miss: "Work out 7 % 2 first.",
  hint: "7 = 2 x 3 + 1",
  explain: "7 % 2 is 1, so `x % 2 == 0` is false and the else branch runs.",
  trick: "`=` assigns, `==` compares. Writing `if (x = 2)` is a compile error in C#, which saves you from a classic C bug."
},
{
  id: "cs-b5", lang: "cs", level: "beginner", title: "for loops",
  learn: ["A `for` loop has three parts: start, condition, step. It repeats while the condition is true.", "`Console.Write` does not add a newline or any separator."],
  lcode: "for (int i = 0; i < 3; i++)\n{\n    Console.Write(i);\n}",
  q: "What is the exact output?",
  code: "for (int i = 0; i < 3; i++)\n    Console.Write(i);",
  type: "type", answers: ["012"],
  wrong: [
    ["^0 ?1 ?2$", "`Write` adds no spaces or commas. The digits sit side by side."],
    ["^123$", "Counting starts at 0, not 1."],
    ["^0123$", "The condition is `i < 3`, so 3 is never printed."]
  ],
  miss: "i takes the values 0, 1, 2. Print each with no separator.",
  hint: "Stops before i reaches 3.",
  explain: "i runs 0, 1, 2 and each is written directly after the previous one: `012`.",
  trick: "Loops that count from 0 and use `<` match array indexes exactly. Make that your default."
},
/* ========================== C# : INTERMEDIATE ========================== */
{
  id: "cs-i1", lang: "cs", level: "intermediate", title: "Arrays and Length",
  learn: ["An array has a fixed size. Its size is the `Length` property (no brackets). A `List<T>` uses `Count` instead."],
  lcode: "int[] nums = { 4, 8, 15 };\nConsole.WriteLine(nums.Length); // 3\nConsole.WriteLine(nums[2]);     // 15",
  q: "Fill the blank to get the number of items in the array.",
  code: "int[] a = { 1, 2, 3, 4 };\nint n = a.___;",
  type: "type", answers: ["Length"],
  wrong: [
    ["^length$", "Properties are capitalised in C#: `Length`."],
    ["^count$", "`Count` is for `List<T>`. Arrays use `Length`."],
    ["^(length|size|count)\\(\\)$", "It is a property, so no parentheses."],
    ["^size$", "`size` is C++ territory (`vector.size()`). In C# arrays use `Length`."]
  ],
  miss: "Arrays have a property for their size. It is not a method.",
  hint: "Starts with L.",
  explain: "Arrays expose `Length`.",
  trick: "Array: `Length`. List: `Count`. String: `Length`. Annoying, but you'll memorise it fast."
},
{
  id: "cs-i2", lang: "cs", level: "intermediate", title: "Lists",
  learn: ["`List<T>` is a resizable collection. Add with `Add`, remove with `Remove`, read with `[index]`."],
  lcode: "var names = new List<string>();\nnames.Add(\"Ada\");\nnames.Add(\"Linus\");\nConsole.WriteLine(names.Count); // 2",
  q: "Which line adds the number 5 to `List<int> list`?",
  type: "choice", ans: 2,
  opts: [
    ["list.Push(5);", "`Push` belongs to `Stack<T>`."],
    ["list.append(5);", "`append` is Python. C# methods start with a capital letter."],
    ["list.Add(5);", "Correct."],
    ["list[list.Count] = 5;", "That index doesn't exist yet and throws `ArgumentOutOfRangeException`. Lists don't grow by assignment."]
  ],
  explain: "`Add` appends to the end.",
  trick: "Need fast lookups by key instead? `Dictionary<TKey,TValue>` is the next collection to learn."
},
{
  id: "cs-i3", lang: "cs", level: "intermediate", title: "Return values",
  learn: ["A method with a return type (`int`, `string` ...) must send a value back with `return`. `void` means it returns nothing."],
  lcode: "static int Add(int a, int b)\n{\n    return a + b;\n}",
  q: "This method won't compile. Why?",
  code: "static int Add(int a, int b)\n{\n    a + b;\n}",
  type: "choice", ans: 0,
  opts: [
    ["It never returns the result. `a + b;` is not a valid statement and there is no `return`.", "Correct. Write `return a + b;`."],
    ["`static` is not allowed on methods.", "`static` methods are fine. Many programs use them."],
    ["`int` cannot be a return type.", "`int` is one of the most common return types."],
    ["Parameters must be declared with `var`.", "`var` isn't allowed on parameters. Spell out their types."]
  ],
  explain: "The method promised an `int` but never returned one.",
  trick: "Short methods can use an expression body: `static int Add(int a, int b) => a + b;`"
},
{
  id: "cs-i4", lang: "cs", level: "intermediate", title: "Null safety",
  learn: ["`?.` stops safely if the thing before it is null (result is null). `??` gives a fallback when the left side is null."],
  lcode: 'string name = null;\nint len = name?.Length ?? 0;   // 0, no crash',
  q: "What does this print?",
  code: "string s = null;\nConsole.WriteLine(s?.Length ?? -1);",
  type: "type", answers: ["-1"],
  wrong: [
    ["^0$", "`s` is null, not an empty string. An empty string would give 0."],
    ["null|^$", "`??` replaces null with the fallback value, so something prints."],
    ["exception", "That is exactly what `?.` prevents. It short-circuits to null."]
  ],
  miss: "s?.Length is null, then ?? swaps null for the value on its right.",
  hint: "Look at the number after ??.",
  explain: "`s?.Length` is null, so `??` gives `-1`.",
  trick: "`NullReferenceException` is the most common C# crash. Enable nullable reference types (`<Nullable>enable</Nullable>`) and let the compiler warn you."
},
{
  id: "cs-i5", lang: "cs", level: "intermediate", title: "Properties",
  learn: ["A property wraps a field with `get` and `set`. Leave out `set` and it is read-only. `private set` lets only the class change it."],
  lcode: "public class Player\n{\n    public string Name { get; set; }\n    public int Id { get; }   // read-only\n}",
  q: "Make `Score` writable by any code, at any time.",
  code: "public class Player\n{\n    public int Score { get; ___; }\n}",
  type: "type", answers: ["set"],
  wrong: [
    ["^init$", "`init` only allows assigning while creating the object (`new Player { Score = 1 }`). Not afterwards."],
    ["^private set$", "`private set` only allows the class itself to change it."],
    ["^(Set)$", "Keywords are lowercase: `set`."]
  ],
  miss: "The opposite of `get`.",
  hint: "Three letters.",
  explain: "`{ get; set; }` gives read and write access.",
  trick: "Type `prop` then press Tab twice in Visual Studio to scaffold a property."
},
/* =========================== C# : ADVANCED =========================== */
{
  id: "cs-a1", lang: "cs", level: "advanced", title: "LINQ",
  learn: ["LINQ lets you query collections with chained methods: `Where` filters, `Select` transforms, `Sum`/`Count`/`Max` aggregate. Needs `using System.Linq;` (implicit in modern projects)."],
  lcode: "var evens = nums.Where(n => n % 2 == 0).ToList();\nvar squares = nums.Select(n => n * n);",
  q: "What is the output?",
  code: "var nums = new[] { 1, 2, 3, 4, 5 };\nConsole.WriteLine(nums.Where(n => n % 2 == 1).Sum());",
  type: "type", answers: ["9"],
  wrong: [
    ["^15$", "That's the sum of everything. `Where` filters first, keeping only the odd numbers."],
    ["^6$", "6 is the sum of the evens (2 + 4). The filter keeps odds."],
    ["^3$", "3 is how many odds there are. `Sum` adds them up."]
  ],
  miss: "Keep the odd numbers, then add them.",
  hint: "1 + 3 + 5",
  explain: "Where keeps 1, 3, 5. Sum gives 9.",
  trick: "LINQ is lazy. `Where` doesn't run until you enumerate or call `ToList()`, `Sum()`, `First()` etc."
},
{
  id: "cs-a2", lang: "cs", level: "advanced", title: "Struct vs class",
  learn: ["`struct` is a value type: assigning it copies the data. `class` is a reference type: assigning copies the reference, so both names point to the same object."],
  lcode: "struct P { public int X; }\nvar a = new P { X = 1 };\nvar b = a;   // b is a COPY",
  q: "What does this print?",
  code: "struct P { public int X; }\n\nvar a = new P { X = 1 };\nvar b = a;\nb.X = 2;\nConsole.WriteLine(a.X);",
  type: "type", answers: ["1"],
  wrong: [["^2$", "That would be true if `P` were a class. As a struct, `b` is an independent copy, so `a` stays 1."]],
  miss: "Is `b = a` a copy or a shared reference?",
  hint: "Value type.",
  explain: "`b` is a copy. Changing it leaves `a` untouched.",
  trick: "Mutable structs are a famous trap. Keep structs small and immutable (`readonly struct`), and use classes for things with identity."
},
{
  id: "cs-a3", lang: "cs", level: "advanced", title: "async / await",
  learn: ["`async` methods can `await` slow work (network, disk, timers) without freezing the thread. While waiting, the thread is free to do other things."],
  lcode: "async Task LoadAsync()\n{\n    await Task.Delay(1000);\n    Console.WriteLine(\"done\");\n}",
  q: "What does `await Task.Delay(1000)` do inside an async method?",
  type: "choice", ans: 1,
  opts: [
    ["Blocks the thread for one second, like `Thread.Sleep`.", "`Thread.Sleep` blocks. `await` does the opposite and frees the thread."],
    ["Pauses this method and frees the thread; the method resumes after about one second.", "Correct."],
    ["Starts a new thread that runs the rest of the method.", "No new thread is created for a timer. The method simply continues later."],
    ["Does nothing unless you also call `.Result`.", "`.Result` blocks and can deadlock UI apps. `await` is the right tool and already works."]
  ],
  explain: "`await` suspends the method without blocking its thread.",
  trick: "Avoid `.Result` and `.Wait()` on tasks in UI or ASP.NET code. Go async all the way up."
},
{
  id: "cs-a4", lang: "cs", level: "advanced", title: "using and IDisposable",
  learn: ["Files, sockets and database connections need cleaning up. `using` calls `Dispose()` for you when the scope ends, even if an exception is thrown."],
  lcode: 'using var reader = new StreamReader("a.txt");\nvar text = reader.ReadToEnd();\n// reader.Dispose() runs automatically here',
  q: "Which option guarantees `Dispose()` is called even if an exception happens?",
  type: "choice", ans: 3,
  opts: [
    ["`var r = new StreamReader(p); r.Dispose();`", "If something throws before that last line, `Dispose` never runs."],
    ["`var r = new StreamReader(p); r = null;`", "Setting null doesn't release the file. It waits for the garbage collector."],
    ["`var r = new StreamReader(p); GC.Collect();`", "The GC isn't deterministic and shouldn't be used for cleanup like this."],
    ["`using var r = new StreamReader(p);`", "Correct. The compiler wraps it in try/finally."]
  ],
  explain: "`using` expands to try/finally with `Dispose()` in the finally.",
  trick: "The `using var x = ...;` form (no braces) disposes at the end of the enclosing block, which keeps code flat."
},
{
  id: "cs-a5", lang: "cs", level: "advanced", title: "Switch expressions",
  learn: ["A switch expression returns a value. Each arm is `pattern => result`, and `_` is the catch-all."],
  lcode: 'string Name(int n) => n switch\n{\n    1 => "one",\n    2 => "two",\n    _ => "many"\n};',
  q: "What does this print?",
  code: 'int n = 3;\nvar r = n switch { 1 => "a", 3 => "c", _ => "z" };\nConsole.WriteLine(r);',
  type: "type", answers: ["c"],
  wrong: [["^z$", "`_` only matches when nothing else did. 3 matches the second arm first."], ["^a$", "n is 3, not 1."]],
  miss: "Find the arm whose pattern equals 3.",
  hint: "Look for `3 =>`.",
  explain: "n is 3, which matches the arm that returns `\"c\"`.",
  trick: "Patterns can be ranges and conditions too: `>= 90 => \"A\"`, `< 50 => \"fail\"`. Great for replacing long if/else chains."
},

/* ============================ C++ : BEGINNER ============================ */
{
  id: "cpp-b1", lang: "cpp", level: "beginner", title: "Hello, iostream",
  learn: ["To print with `std::cout` you must include the header that defines it. `#include` pulls a header into your file. The one for console input/output is `iostream`."],
  lcode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello!\\n";\n    return 0;\n}',
  q: "Which header must be included to use `std::cout`?",
  code: '#include <___>\n\nint main() {\n    std::cout << "Hi\\n";\n}',
  type: "type", answers: ["iostream", "<iostream>"],
  wrong: [
    ["^(<)?stdio(\\.h)?(>)?$", "`stdio.h` is the C header for `printf`. C++ streams live in `iostream`."],
    ["^(<)?iostream\\.h(>)?$", "The `.h` version is pre-standard and gone. Use plain `iostream`."],
    ["^(<)?cout(>)?$", "`cout` is the thing you print with. The header that provides it is `iostream`."]
  ],
  miss: "i-o-stream: input/output stream.",
  hint: "Standard C++ headers have no .h",
  explain: "`<iostream>` declares `std::cout`, `std::cin` and friends.",
  trick: "Missing-header errors usually say \"'cout' is not a member of 'std'\". Add the include and it vanishes."
},
{
  id: "cpp-b2", lang: "cpp", level: "beginner", title: "Declaring variables",
  learn: ["C++ is statically typed. Basic types: `int`, `double`, `char`, `bool`, and `std::string` (include `<string>`). Let the compiler work it out with `auto`."],
  lcode: 'int x = 10;\ndouble pi = 3.14;\nauto y = 42;   // int',
  q: "Which line declares an integer set to 10?",
  type: "choice", ans: 1,
  opts: [
    ["var x = 10;", "`var` is C#. In C++ the equivalent is `auto`."],
    ["int x = 10;", "Correct."],
    ["int x := 10;", "`:=` is Go/Pascal. C++ uses `=`."],
    ["integer x = 10;", "The keyword is `int`."]
  ],
  explain: "Type, name, `=`, value, semicolon.",
  trick: "Initialise every variable. An uninitialised local `int` holds garbage, and reading it is undefined behaviour."
},
{
  id: "cpp-b3", lang: "cpp", level: "beginner", title: "Integer division",
  learn: ["When both sides of `/` are integers, C++ throws away the fraction. It truncates toward zero (it does not round)."],
  lcode: "std::cout << 7 / 2;      // 3\nstd::cout << 7 / 2.0;    // 3.5",
  q: "What does this print?",
  code: "int a = 5, b = 2;\nstd::cout << a / b;",
  type: "type", answers: ["2"],
  wrong: [
    ["^2\\.5$", "Both are `int`, so the result is an `int` too and the .5 is lost."],
    ["^3$", "Integer division truncates. It doesn't round up."]
  ],
  miss: "int divided by int gives int.",
  hint: "Two whole numbers go in, one comes out.",
  explain: "5 / 2 is 2 with the remainder dropped.",
  trick: "To get 2.5, make one side a double: `a / static_cast<double>(b)`."
},
{
  id: "cpp-b4", lang: "cpp", level: "beginner", title: "Loops and spacing",
  learn: ["`std::cout << x << \" \"` prints x followed by a space. Chain as many `<<` as you like."],
  lcode: 'for (int i = 0; i < 3; i++)\n    std::cout << i << " ";\n// 0 1 2',
  q: "What is the output? (Separate with single spaces.)",
  code: 'for (int i = 1; i <= 3; i++)\n    std::cout << i * 2 << " ";',
  type: "type", answers: ["2 4 6"],
  wrong: [
    ["^246$", "A space is printed after each number, so they don't touch."],
    ["^1 2 3$", "The loop prints `i * 2`, not `i`."],
    ["^2 4 6 8$", "`i <= 3` stops after i = 3."]
  ],
  miss: "i is 1, 2, 3. Print each doubled.",
  hint: "Double 1, 2, 3.",
  explain: "i * 2 gives 2, 4, 6.",
  trick: "`'\\n'` is faster than `std::endl` because `endl` also flushes the buffer."
},
{
  id: "cpp-b5", lang: "cpp", level: "beginner", title: "std::string",
  learn: ["`std::string` is a resizable text type. Join with `+=` and get its length with `.size()` (or `.length()`)."],
  lcode: '#include <string>\nstd::string s = "hi";\ns += "!";\nstd::cout << s;  // hi!',
  q: "What does this print?",
  code: 'std::string s = "hi";\ns += "!";\nstd::cout << s.size();',
  type: "type", answers: ["3"],
  wrong: [
    ["^2$", "That was the size before `+=` added the exclamation mark."],
    ["^hi!$", "`size()` returns a number, not the text."]
  ],
  miss: "Count characters after the append: h, i, !",
  hint: "Three characters.",
  explain: "After `+=`, s is \"hi!\", so its size is 3.",
  trick: "`size()` returns an unsigned type. Comparing it with a negative `int` gives surprising results, so watch the compiler warnings."
},
/* ========================== C++ : INTERMEDIATE ========================== */
{
  id: "cpp-i1", lang: "cpp", level: "intermediate", title: "References",
  learn: ["By default C++ passes arguments by copy. Add `&` to the parameter type and the function works on the original instead (a reference)."],
  lcode: "void inc(int& x) { x++; }\n\nint n = 1;\ninc(n);\n// n is now 2",
  q: "Fill the blank so `inc(n)` really changes `n`.",
  code: "void inc(int ___ x) { x++; }",
  type: "type", answers: ["&"],
  wrong: [
    ["^\\*$", "`*` makes a pointer. You'd have to call `inc(&n)` and write `(*x)++`. A reference is simpler."],
    ["^&&$", "`&&` is an rvalue reference, used for move semantics."]
  ],
  miss: "One symbol. It means 'alias for the original'.",
  hint: "The ampersand.",
  explain: "`int&` binds to the caller's variable instead of copying it.",
  trick: "Read declarations right to left: `int& x` is 'x is a reference to int'."
},
{
  id: "cpp-i2", lang: "cpp", level: "intermediate", title: "std::vector",
  learn: ["`std::vector<T>` is a resizable array (include `<vector>`). Use `push_back` to add and `size()` to count."],
  lcode: "std::vector<int> v = {1, 2, 3};\nv.push_back(4);\nstd::cout << v.back();  // 4",
  q: "What does this print?",
  code: "std::vector<int> v = {1, 2, 3};\nv.push_back(4);\nstd::cout << v.size();",
  type: "type", answers: ["4"],
  wrong: [["^3$", "That's before the `push_back`. The vector grew."]],
  miss: "Start with 3 items, add 1.",
  hint: "3 + 1",
  explain: "`push_back(4)` appends, so the size is 4.",
  trick: "Prefer `std::vector` over raw arrays almost always. If you know the size ahead, call `v.reserve(n)` to avoid reallocations."
},
{
  id: "cpp-i3", lang: "cpp", level: "intermediate", title: "Pointers",
  learn: ["A pointer holds an address. `&x` gets the address of x. `*p` follows the pointer to the value (dereference)."],
  lcode: "int x = 5;\nint* p = &x;\n*p = 9;      // writes into x\n// x is 9",
  q: "What does this print?",
  code: "int x = 5;\nint* p = &x;\n*p = 9;\nstd::cout << x;",
  type: "type", answers: ["9"],
  wrong: [["^5$", "`p` points at `x`, so `*p = 9` writes straight into `x`."]],
  miss: "`*p` and `x` are the same memory.",
  hint: "Writing through the pointer changes the original.",
  explain: "`*p = 9` stores 9 where p points, which is x.",
  trick: "Prefer references when you can. Use pointers when 'nothing' (`nullptr`) is a valid state."
},
{
  id: "cpp-i4", lang: "cpp", level: "intermediate", title: "const references",
  learn: ["Copying a big object like a string or vector is slow. Pass it as `const T&`: no copy, and the function promises not to modify it."],
  lcode: "void print(const std::string& s) {\n    std::cout << s;\n}",
  q: "Best way to pass a large `std::string` to a function that only reads it?",
  type: "choice", ans: 2,
  opts: [
    ["`void f(std::string s)`", "Works, but copies the whole string every call."],
    ["`void f(std::string& s)`", "No copy, but the function could change it, and you can't pass literals or temporaries."],
    ["`void f(const std::string& s)`", "Correct. No copy, read-only, and it accepts temporaries."],
    ["`void f(std::string* s)`", "Legal, but needs null checks and `*s` everywhere. A const reference is cleaner."]
  ],
  explain: "`const T&` avoids the copy and blocks accidental edits.",
  trick: "Cheap types (`int`, `double`, `char`, pointers) are passed by value. Use `const&` for anything bigger."
},
{
  id: "cpp-i5", lang: "cpp", level: "intermediate", title: "Out of bounds",
  learn: ["C++ does not check array or vector indexes with `[]`. Reading or writing past the end is undefined behaviour (UB): anything can happen."],
  lcode: "std::vector<int> v = {1, 2, 3};\nv.at(5);   // throws std::out_of_range\nv[5];      // UB, no check",
  q: "What happens here?",
  code: "int arr[3] = {1, 2, 3};\narr[3] = 4;",
  type: "choice", ans: 2,
  opts: [
    ["A compile error.", "Compilers usually can't prove it for you, and plain indexing isn't checked."],
    ["It throws `std::out_of_range`.", "Only `vector::at()` does that. Raw arrays and `[]` never throw."],
    ["Undefined behaviour: it may crash, corrupt memory, or even appear to work.", "Correct. Valid indexes are 0 to 2."],
    ["The array grows to 4 elements.", "Arrays have fixed size. They never grow."]
  ],
  explain: "`arr[3]` is one past the end. Writing there is undefined behaviour.",
  trick: "Compile with `-fsanitize=address,undefined` (GCC/Clang) in debug builds. It catches these bugs instantly."
},
/* =========================== C++ : ADVANCED =========================== */
{
  id: "cpp-a1", lang: "cpp", level: "advanced", title: "Smart pointers",
  learn: ["Raw `new` and `delete` leak memory if you forget or if an exception skips the `delete`. Smart pointers free memory automatically: `unique_ptr` (one owner) and `shared_ptr` (shared ownership with a counter)."],
  lcode: "#include <memory>\nauto p = std::make_unique<int>(5);\n// freed automatically when p goes out of scope",
  q: "You need one owner of a heap-allocated object. What should be your default choice?",
  type: "choice", ans: 1,
  opts: [
    ["Raw `new` / `delete`", "Easy to leak, and an exception between the two skips `delete`."],
    ["`std::unique_ptr` via `std::make_unique`", "Correct. Zero overhead and clear ownership."],
    ["`std::shared_ptr` everywhere", "It works but adds a reference count and hides who owns what. Use it only when ownership is truly shared."],
    ["A global raw pointer", "Globals plus raw pointers make lifetimes hard to reason about."]
  ],
  explain: "`unique_ptr` is the default owner. Upgrade to `shared_ptr` only if you need shared ownership.",
  trick: "Write `make_unique` / `make_shared` instead of `new`. It's shorter and exception-safe."
},
{
  id: "cpp-a2", lang: "cpp", level: "advanced", title: "std::move",
  learn: ["Moving transfers a resource (like a vector's buffer) instead of copying it. `std::move` is the signal you give the compiler that says 'I'm done with this object, you may steal from it'."],
  lcode: "std::vector<int> a(1000000);\nstd::vector<int> b = std::move(a);  // cheap: steals the buffer",
  q: "What does `std::move(x)` actually do?",
  type: "choice", ans: 0,
  opts: [
    ["Casts `x` to an rvalue so a move constructor/assignment can be chosen.", "Correct. It's just a cast. The move happens in the constructor that receives it."],
    ["Moves the data immediately.", "`std::move` itself moves nothing. It only enables a move."],
    ["Copies `x` and then deletes the original.", "That's a slower copy. Moving never needs a full copy."],
    ["Allocates `x` on the heap.", "It has nothing to do with allocation."]
  ],
  explain: "`std::move` = `static_cast<T&&>`. Plain cast, no work.",
  trick: "After moving from an object, only assign to it or destroy it. Don't assume what it contains."
},
{
  id: "cpp-a3", lang: "cpp", level: "advanced", title: "Template deduction",
  learn: ["A function template deduces `T` from the arguments. Every argument that uses `T` must agree on one type."],
  lcode: "template <typename T>\nT maxOf(T a, T b) { return a > b ? a : b; }\n\nmaxOf(3, 7);        // T = int\nmaxOf<double>(3, 7.5);  // explicit",
  q: "Why does `maxOf(3, 7.5)` fail to compile?",
  type: "choice", ans: 3,
  opts: [
    ["Templates can't take `double`.", "They take any type that supports the operations used."],
    ["The `?:` operator can't compare numbers.", "`?:` works fine here."],
    ["`maxOf` has no return type.", "The return type is `T`."],
    ["`T` deduces as `int` from `3` and `double` from `7.5`, a conflict.", "Correct. Fix: `maxOf<double>(3, 7.5)` or cast one argument."]
  ],
  explain: "Deduction can't pick one `T` that matches both arguments.",
  trick: "Read template errors from the first line and the last 'required from here'. The middle is noise."
},
{
  id: "cpp-a4", lang: "cpp", level: "advanced", title: "RAII and locks",
  learn: ["RAII means resources are acquired in a constructor and released in the destructor, so cleanup happens automatically even when exceptions fly."],
  lcode: "std::mutex m;\nvoid work() {\n    std::lock_guard<std::mutex> lock(m);\n    // unlocked automatically on exit\n}",
  q: "Which option guarantees the mutex is unlocked even if an exception is thrown?",
  type: "choice", ans: 1,
  opts: [
    ["`m.lock(); doWork(); m.unlock();`", "If `doWork()` throws, `unlock()` never runs and the mutex stays locked."],
    ["`std::lock_guard<std::mutex> g(m); doWork();`", "Correct. The destructor unlocks during stack unwinding."],
    ["`m.lock(); if (ok) m.unlock();`", "Skipping the unlock on some paths is exactly the bug RAII prevents."],
    ["`doWork(); m.lock();`", "That locks after the work and never unlocks."]
  ],
  explain: "`lock_guard` unlocks in its destructor, whatever way the scope is left.",
  trick: "Reach for `std::scoped_lock` (C++17) when you need to lock several mutexes at once without deadlocks."
},
{
  id: "cpp-a5", lang: "cpp", level: "advanced", title: "Lambda captures",
  learn: ["A lambda `[n](int x){...}` captures `n` by value at the moment the lambda is created. `[&n]` captures a reference and sees later changes."],
  lcode: "int n = 2;\nauto byVal = [n](int x) { return x * n; };\nauto byRef = [&n](int x) { return x * n; };\nn = 10;\n// byVal(5) -> 10, byRef(5) -> 50",
  q: "What does this print?",
  code: "int n = 2;\nauto f = [n](int x) { return x * n; };\nn = 10;\nstd::cout << f(5);",
  type: "type", answers: ["10"],
  wrong: [["^50$", "`[n]` copied n when `f` was created, so it stays 2. Only `[&n]` would see the 10."]],
  miss: "Which value of n did the lambda copy?",
  hint: "The copy was taken before n changed.",
  explain: "The lambda holds its own copy n = 2, so 5 * 2 = 10.",
  trick: "Default to explicit captures. `[=]` and `[&]` hide what you depend on, and `[&]` can dangle if the lambda outlives the variables."
}
];
