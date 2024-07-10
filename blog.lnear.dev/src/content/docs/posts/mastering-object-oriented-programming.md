---
title: "Mastering Object-Oriented Programming: A Comprehensive Guide"
slug: mastering-object-oriented-programming
description: "Composition and inheritance fundamental concepts for designing relationships between classes. Each approach offers distinct advantages and is suitable for different..."
createdAt: "2024-01-30T00:00:00+00:00"
updatedAt: "2024-01-30T00:00:00+00:00"
---

#

Object-Oriented Programming (OOP) is a powerful paradigm that forms the foundation of modern software development. This comprehensive guide will explore the core concepts, principles, and advanced techniques of OOP, providing you with a deep understanding of how to leverage its full potential in your projects.

OOP is based on the concept of "objects," which can contain data (in the form of fields) and code (in the form of procedures or methods). Unlike procedural programming, where the focus is on functions, OOP focuses on objects that represent real-world entities.

The concept of OOP was first introduced in the 1960s with the Simula language, designed for simulation purposes. The ideas were later expanded upon in the 1980s with the development of languages like Smalltalk, which fully embraced the OOP paradigm. The 1990s saw the rise of OOP with languages such as C++ and Java, solidifying its place in mainstream programming.

### Benefits of Using OOP

1. **Modularity**: Code is organized into discrete objects that can be developed, tested, and debugged independently.
2. **Reusability**: Objects and classes can be reused across different programs, reducing redundancy.
3. **Scalability**: OOP makes it easier to manage and expand codebases, as objects can be easily extended and modified.
4. **Maintainability**: Encapsulation and abstraction help in maintaining and updating code with minimal impact on other parts of the program.

## Core Concepts of Object-Oriented Programming

### 1. Classes and Objects

- **Classes**: A class is a blueprint for creating objects. It defines a type of object according to the methods and properties that it should have.
- **Objects**: Objects are instances of classes that contain actual data and can perform functions defined by their class.

Imagine a silicone mold (class) for a toy car. When you pour liquid plastic into the mold, you create an actual toy car (object) that has specific features and can perform certain actions. You can create multiple toy cars from the same mold, just as you can create multiple objects from the same class. Pouring different colors of plastic into the mold would create toy cars with different appearances, just as passing different data to a class constructor can create objects with different properties.

```php
<?php
class Book {
    public function __construct(
        private string $isbn,
        private string $title,
        private string $author,
        private int $publicationYear,
        private bool $isAvailable = true
    ) {}

    public function getIsbn(): string {
        return $this->isbn;
    }

    public function getTitle(): string {
        return $this->title;
    }

    public function isAvailable(): bool {
        return $this->isAvailable;
    }

    public function checkOut(): void {
        if (!$this->isAvailable) {
            throw new Exception("Book is not available for checkout");
        }
        $this->isAvailable = false;
    }

    public function returnBook(): void {
        $this->isAvailable = true;
    }
}

class Library {
    private array $books = [];

    public function addBook(Book $book): static {
        $this->books[$book->getIsbn()] = $book;
        return $this; // For method chaining
    }

    public function checkOutBook(string $isbn): void {
        if (!isset($this->books[$isbn])) {
            throw new Exception("Book not found in library");
        }
        $this->books[$isbn]->checkOut();
    }

    public function returnBook(string $isbn): void {
        if (!isset($this->books[$isbn])) {
            throw new Exception("Book not found in library");
        }
        $this->books[$isbn]->returnBook();
    }

    public function findAvailableBooks(): array {
        return array_filter($this->books, fn($book) => $book->isAvailable());
    }
}

$library = new Library();
$library->addBook(new Book("978-0132350884", "Clean Code", "Robert C. Martin", 2008))
        ->addBook(new Book("978-0201633610", "Design Patterns", "Erich Gamma et al.", 1994));

$library->checkOutBook("978-0132350884");
$availableBooks = $library->findAvailableBooks();
foreach ($availableBooks as $book) {
    echo $book->getTitle() . " is available\n";
}
```

### 2. Abstraction

Abstraction is the process of hiding complex implementation details and exposing only the essential features of an object. It allows you to focus on what an object does rather than how it does it.

```php
<?php
abstract class PaymentGateway {
    public function __construct(protected string $apiKey, protected string $merchantId) {}
    abstract public function processPayment(float $amount, string $currency): array;
    abstract public function refundPayment(string $transactionId, float $amount): bool;

    protected function validateAmount(float $amount): void {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Amount must be greater than zero");
        }
    }

    protected function logTransaction(string $type, float $amount, string $currency): void {
        // Log transaction details
    }
}

class StripeGateway extends PaymentGateway {
    public function processPayment(float $amount, string $currency): array {
        $this->validateAmount($amount);
        // Simulate Stripe API call
        $response = [
            'success' => true,
            'transaction_id' => uniqid('stripe_'),
            'amount' => $amount,
            'currency' => $currency
        ];
        $this->logTransaction('payment', $amount, $currency);
        return $response;
    }

    public function refundPayment(string $transactionId, float $amount): bool {
        $this->validateAmount($amount);
        // Simulate Stripe refund API call
        $success = (bool) random_int(0, 1);
        if ($success) {
            $this->logTransaction('refund', $amount, 'USD');
        }
        return $success;
    }
}

class PayPalGateway extends PaymentGateway {
    public function processPayment(float $amount, string $currency): array {
        $this->validateAmount($amount);
        // Simulate PayPal API call
        $response = [
            'success' => true,
            'transaction_id' => uniqid('paypal_'),
            'amount' => $amount,
            'currency' => $currency
        ];
        $this->logTransaction('payment', $amount, $currency);
        return $response;
    }

    public function refundPayment(string $transactionId, float $amount): bool {
        $this->validateAmount($amount);
        // Simulate PayPal refund API call
        $success = (bool) random_int(0, 1);
        if ($success) {
            $this->logTransaction('refund', $amount, 'USD');
        }
        return $success;
    }
}

$stripeGateway = new StripeGateway('stripe_api_key', 'stripe_merchant_id');
$paypalGateway = new PayPalGateway('paypal_api_key', 'paypal_merchant_id');

$paymentResult = $stripeGateway->processPayment(100.00, 'USD');
print_r($paymentResult);

$refundResult = $paypalGateway->refundPayment('paypal_123456', 50.00);
echo $refundResult ? "Refund successful" : "Refund failed";
```

### 3. Encapsulation

Encapsulation involves bundling the data and the methods that operate on the data into a single unit, or class, and restricting access to some of the object's components. It protects the internal state of the object and only exposes a controlled interface.

```php
<?php
class Transaction {
    public function __construct(
        private string $type,
        private float $amount,
        private string $description,
        private DateTime $date
    ) {}

    public function getType(): string {
        return $this->type;
    }

    public function getAmount(): float {
        return $this->amount;
    }

    public function getDescription(): string {
        return $this->description;
    }

    public function getDate(): DateTime {
        return $this->date;
    }
}

class BankAccount {
    private array $transactions = [];
    private float $balance = 0;

    public function __construct(
        private string $accountNumber,
        private string $accountHolder
    ) {}

    public function deposit(float $amount, string $description): void {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Deposit amount must be positive");
        }
        $this->balance += $amount;
        $this->addTransaction('deposit', $amount, $description);
    }

    public function withdraw(float $amount, string $description): void {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Withdrawal amount must be positive");
        }
        if ($amount > $this->balance) {
            throw new Exception("Insufficient funds");
        }
        $this->balance -= $amount;
        $this->addTransaction('withdrawal', $amount, $description);
    }

    public function getBalance(): float {
        return $this->balance;
    }

    public function getAccountSummary(): array {
        return [
            'account_number' => $this->accountNumber,
            'account_holder' => $this->accountHolder,
            'balance' => $this->balance,
            'transaction_count' => count($this->transactions)
        ];
    }

    public function getTransactionHistory(): array {
        return array_map(function($transaction) {
            return [
                'type' => $transaction->getType(),
                'amount' => $transaction->getAmount(),
                'description' => $transaction->getDescription(),
                'date' => $transaction->getDate()->format('Y-m-d H:i:s')
            ];
        }, $this->transactions);
    }

    private function addTransaction(string $type, float $amount, string $description): void {
        $this->transactions[] = new Transaction($type, $amount, $description, new DateTimeImmutable);
    }
}

$account = new BankAccount("1234567890", "John Doe");
$account->deposit(1000, "Initial deposit");
$account->withdraw(250, "ATM withdrawal");
$account->deposit(500, "Salary");

print_r($account->getAccountSummary());
print_r($account->getTransactionHistory());
```

### 4. Inheritance

Inheritance is the mechanism by which one class can inherit the properties and methods of another class. It promotes code reusability and establishes a natural hierarchy between classes.

```php
<?php
abstract class Content {
    protected $id;
    protected $createdAt;
    protected $updatedAt;

    public function __construct(protected string $title, protected string $author) {
        $this->id = uniqid();
        $this->title = $title;
        $this->author = $author;
        $this->createdAt = new DateTimeImmutable;
        $this->updatedAt = new DateTimeImmutable;
    }

    abstract public function render(): string;

    public function update(
        ?string $title = null,
        ?string $author = null
    ): void {
        if ($title !== null) {
            $this->title = $title;
        }
        if ($author !== null) {
            $this->author = $author;
        }
        $this->updatedAt = new DateTimeImmutable;
    }

    public function getMetadata(): array {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => $this->author,
            'created_at' => $this->createdAt->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt->format('Y-m-d H:i:s')
        ];
    }
}

class Article extends Content {
    protected $body;
    protected $tags = [];

    public function __construct(string $title, string $author, string $body, array $tags = []) {
        parent::__construct($title, $author);
        $this->body = $body;
        $this->tags = $tags;
    }

    public function render(): string {
        return "<article>
            <h1>{$this->title}</h1>
            <p>By {$this->author}</p>
            <div>{$this->body}</div>
            <div>Tags: " . implode(', ', $this->tags) . "</div>
        </article>";
    }

    public function addTag(string $tag): void {
        if (!in_array($tag, $this->tags)) {
            $this->tags[] = $tag;
            $this->updatedAt = new DateTimeImmutable;
        }
    }
}

class Video extends Content {

    public function __construct(string $title, string $author, protected string $videoUrl, protected int $duration) {
        parent::__construct($title, $author);
    }

    public function render(): string {
        return "<video>
            <h2>{$this->title}</h2>
            <p>By {$this->author}</p>
            <iframe src='{$this->videoUrl}'></iframe>
            <p>Duration: {$this->duration} seconds</p>
        </video>";
    }
}

$article = new Article("Understanding OOP", "Jane Doe", "Object-Oriented Programming is...", ["PHP", "OOP"]);
$video = new Video("OOP in Action", "John Smith", "https://example.com/video", 600);

echo $article->render();
echo $video->render();

$article->addTag("Programming");
print_r($article->getMetadata());
```

### 5. Polymorphism

Polymorphism allows objects of different classes to be treated as objects of a common superclass. It is often expressed through method overriding and overloading, enabling a single interface to represent different underlying forms (data types).

```php
<?php
interface Drawable {
    public function draw(): string;
    public function resize(float $factor): void;
}

abstract class Shape implements Drawable {
    protected float $x;
    protected float $y;

    public function __construct(float $x, float $y) {
        $this->x = $x;
        $this->y = $y;
    }

    abstract public function getArea(): float;
    abstract public function getPerimeter(): float;
}

class Circle extends Shape {
    private float $radius;

    public function __construct(float $x, float $y, float $radius) {
        parent::__construct($x, $y);
        $this->radius = $radius;
    }

    public function draw(): string {
        return "Drawing a circle at ({$this->x}, {$this->y}) with radius {$this->radius}";
    }

    public function resize(float $factor): void {
        $this->radius *= $factor;
    }

    public function getArea(): float {
        return pi() * $this->radius ** 2;
    }

    public function getPerimeter(): float {
        return 2 * pi() * $this->radius;
    }
}

class Rectangle extends Shape {
    private float $width;
    private float $height;

    public function __construct(float $x, float $y, float $width, float $height) {
        parent::__construct($x, $y);
        $this->width = $width;
        $this->height = $height;
    }

    public function draw(): string {
        return "Drawing a rectangle at ({$this->x}, {$this->y}) with width {$this->width} and height {$this->height}";
    }

    public function resize(float $factor): void {
        $this->width *= $factor;
        $this->height *= $factor;
    }

    public function getArea(): float {
        return $this->width * $this->height;
    }

    public function getPerimeter(): float {
        return 2 * ($this->width + $this->height);
    }
}

class Triangle extends Shape {

    public function __construct(float $x, float $y, private float $side1, private float $side2, private float $side3) {
        parent::__construct($x, $y);
    }

    public function draw(): string {
        return "Drawing a triangle at ({$this->x}, {$this->y}) with sides {$this->side1}, {$this->side2}, {$this->side3}";
    }

    public function resize(float $factor): void {
        $this->side1 *= $factor;
        $this->side2 *= $factor;
        $this->side3 *= $factor;
    }

    public function getArea(): float {
        $s = ($this->side1 + $this->side2 + $this->side3) / 2;
        return sqrt($s * ($s - $this->side1) * ($s - $this->side2) * ($s - $this->side3));
    }

    public function getPerimeter(): float {
        return $this->side1 + $this->side2 + $this->side3;
    }
}
class Canvas {
    private array $shapes = [];

    public function addShape(Shape $shape): void {
        $this->shapes[] = $shape;
    }

    public function drawAll(): array {
        return array_map(fn($shape) => $shape->draw(), $this->shapes);
    }

    public function getTotalArea(): float {
        return array_sum(array_map(fn($shape) => $shape->getArea(), $this->shapes));
    }

    public function getTotalPerimeter(): float {
        return array_sum(array_map(fn($shape) => $shape->getPerimeter(), $this->shapes));
    }

    public function resizeAll(float $factor): void {
        foreach ($this->shapes as $shape) {
            $shape->resize($factor);
        }
    }
}

// Usage example
$canvas = new Canvas();

$circle = new Circle(0, 0, 5);
$rectangle = new Rectangle(10, 10, 4, 6);
$triangle = new Triangle(5, 5, 3, 4, 5);

$canvas->addShape($circle);
$canvas->addShape($rectangle);
$canvas->addShape($triangle);

// Draw all shapes
$drawings = $canvas->drawAll();
foreach ($drawings as $drawing) {
    echo $drawing . "\n";
}

// Calculate total area and perimeter
echo "Total area: " . $canvas->getTotalArea() . "\n";
echo "Total perimeter: " . $canvas->getTotalPerimeter() . "\n";

// Resize all shapes
$canvas->resizeAll(1.5);

// Draw all shapes again after resizing
$drawings = $canvas->drawAll();
foreach ($drawings as $drawing) {
    echo $drawing . "\n";
}

// Calculate new total area and perimeter
echo "New total area: " . $canvas->getTotalArea() . "\n";
echo "New total perimeter: " . $canvas->getTotalPerimeter() . "\n";
```

## Advanced OOP Concepts

### SOLID Principles

SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable:

1. **Single Responsibility Principle (SRP)**: A class should have only one reason to change.
2. **Open/Closed Principle (OCP)**: Software entities should be open for extension but closed for modification.
3. **Liskov Substitution Principle (LSP)**: Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.
4. **Interface Segregation Principle (ISP)**: Many client-specific interfaces are better than one general-purpose interface.
5. **Dependency Inversion Principle (DIP)**: Depend upon abstractions, not concretions.

```php
<?php
// Single Responsibility Principle
class User {
    public function __construct(
        private string $name,
        private string $email
    ) {}

    public function getName(): string {
        return $this->name;
    }

    public function getEmail(): string {
        return $this->email;
    }
}

class UserRepository {
    private $database;

    public function __construct(DatabaseConnection $database) {
        $this->database = $database;
    }

    public function save(User $user): void {
        // Save user to database
    }

    public function findByEmail(string $email): ?User {
        // Find user by email
    }
}

class UserValidator {
    public function validate(User $user): bool {
        // Validate user data
    }
}

// Open/Closed Principle
interface PaymentProcessor {
    public function processPayment(float $amount): bool;
}

class CreditCardProcessor implements PaymentProcessor {
    public function processPayment(float $amount): bool {
        // Process credit card payment
    }
}

class PayPalProcessor implements PaymentProcessor {
    public function processPayment(float $amount): bool {
        // Process PayPal payment
    }
}

// Liskov Substitution Principle
abstract class Bird {
    abstract public function move(): void;
}

class FlyingBird extends Bird {
    public function move(): void {
        echo "Flying";
    }
}

class WalkingBird extends Bird {
    public function move(): void {
        echo "Walking";
    }
}

// Interface Segregation Principle
interface Workable {
    public function work(): void;
}

interface Eatable {
    public function eat(): void;
}

class Human implements Workable, Eatable {
    public function work(): void {
        // Human working
    }

    public function eat(): void {
        // Human eating
    }
}

class Robot implements Workable {
    public function work(): void {
        // Robot working
    }
}

// Dependency Inversion Principle
interface Logger {
    public function log(string $message): void;
}

class FileLogger implements Logger {
    public function log(string $message): void {
        // Log to file
    }
}

class DatabaseLogger implements Logger {
    public function log(string $message): void {
        // Log to database
    }
}

class UserManager {
    private $logger;

    public function __construct(Logger $logger) {
        $this->logger = $logger;
    }

    public function createUser(User $user): void {
        // Create user logic
        $this->logger->log("User created: " . $user->getEmail());
    }
}

// Usage
$fileLogger = new FileLogger();
$userManager = new UserManager($fileLogger);
$user = new User("John Doe", "john@example.com");
$userManager->createUser($user);
```

### Design Patterns

Design patterns are typical solutions to common problems in software design. They are templates for how to solve a problem that can be used in many different situations. Some common design patterns include:

1. **Singleton Pattern**: Ensures a class has only one instance and provides a global point of access to it.
2. **Factory Pattern**: Creates objects without exposing the instantiation logic to the client.
3. **Observer Pattern**: Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
4. **Strategy Pattern**: Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
5. **Decorator Pattern**: Allows behavior to be added to an individual object, either statically or dynamically, without affecting the behavior of other objects from the same class.
6. **Adapter Pattern**: Allows incompatible interfaces to work together.
7. **Facade Pattern**: Provides a simplified interface to a complex system.
8. **Composite Pattern**: Allows you to compose objects into tree structures to represent part-whole hierarchies.
9. **Factory Method Pattern**: Defines an interface for creating objects but lets subclasses alter the type of objects that will be created.
10. **Prototype Pattern**: Creates new objects by copying an existing object, known as the prototype.
11. **Builder Pattern**: Separates the construction of a complex object from its representation, allowing the same construction process to create different representations.

I won't go into detail about each design pattern here, but I'll provide an example of the Observer Pattern to illustrate how design patterns can be implemented in PHP.

#### Observer Pattern Example:

```php
<?php
interface Subject {
    public function attach(Observer $observer): void;
    public function detach(Observer $observer): void;
    public function notify(): void;
}

interface Observer {
    public function update(Subject $subject): void;
}

class Stock implements Subject {
    private array $observers = [];
    private string $symbol;
    private float $price;

    public function __construct(string $symbol, float $price) {
        $this->symbol = $symbol;
        $this->price = $price;
    }

    public function attach(Observer $observer): void {
        $this->observers[] = $observer;
    }

    public function detach(Observer $observer): void {
        $key = array_search($observer, $this->observers, true);
        if ($key !== false) {
            unset($this->observers[$key]);
        }
    }

    public function notify(): void {
        foreach ($this->observers as $observer) {
            $observer->update($this);
        }
    }

    public function setPrice(float $price): void {
        if ($this->price != $price) {
            $this->price = $price;
            $this->notify();
        }
    }

    public function getSymbol(): string {
        return $this->symbol;
    }

    public function getPrice(): float {
        return $this->price;
    }
}

class StockExchange {
    private array $stocks = [];

    public function addStock(Stock $stock): void {
        $this->stocks[$stock->getSymbol()] = $stock;
    }

    public function updateStockPrice(string $symbol, float $price): void {
        if (isset($this->stocks[$symbol])) {
            $this->stocks[$symbol]->setPrice($price);
        }
    }
}

class Investor implements Observer {
    private string $name;
    private array $stocks = [];

    public function __construct(string $name) {
        $this->name = $name;
    }

    public function update(Subject $subject): void {
        if ($subject instanceof Stock) {
            echo "{$this->name} notified about {$subject->getSymbol()} price change to {$subject->getPrice()}\n";
        }
    }

    public function addStock(Stock $stock): void {
        $this->stocks[$stock->getSymbol()] = $stock;
        $stock->attach($this);
    }
}

// Usage
$exchange = new StockExchange();

$apple = new Stock("AAPL", 150.0);
$google = new Stock("GOOGL", 2700.0);

$exchange->addStock($apple);
$exchange->addStock($google);

$investor1 = new Investor("John Doe");
$investor2 = new Investor("Jane Smith");

$investor1->addStock($apple);
$investor1->addStock($google);
$investor2->addStock($apple);

$exchange->updateStockPrice("AAPL", 155.0);
$exchange->updateStockPrice("GOOGL", 2750.0);
```

## Choosing Between Composition and Inheritance

When designing relationships between classes, developers often face the choice between composition and inheritance. Both approaches have their merits and are suitable for different scenarios.

'Composition over inheritance' is a common principle in object-oriented design, emphasizing the use of composition to achieve code reuse and flexibility. I prefer 'Composition isn't inheritance' because it's not about choosing one over the other but understanding when to use each approach.

### Inheritance

Inheritance allows a class to inherit properties and methods from another class. It's often the first concept new PHP developers learn for code reuse.

#### Example: Animal Hierarchy

```php
abstract class Animal
{
    public function __construct(protected string $name) {}
    abstract public function makeSound(): string;
}

class Dog extends Animal
{
    public function makeSound(): string
    {
        return "{$this->name} says Woof!";
    }
}

class Cat extends Animal
{
    public function makeSound(): string
    {
        return "{$this->name} says Meow!";
    }
}

$dog = new Dog("Buddy");
echo $dog->makeSound(); // Outputs: Buddy says Woof!
```

#### Pros of Inheritance:

1. Clear hierarchical relationships
2. Shared implementation

#### Cons of Inheritance:

1. Tight coupling
2. Rigid hierarchies
3. Potential for misuse (inheriting unnecessary methods)

### Composition

Composition involves creating complex objects by combining simpler ones. It offers more flexibility and loose coupling.

#### Example: Game Character

```php
class Health
{
    private int $points = 100;

    public function decrease(int $amount): void
    {
        $this->points = max(0, $this->points - $amount);
    }

    public function increase(int $amount): void
    {
        $this->points += $amount;
    }

    public function getCurrentHealth(): int
    {
        return $this->points;
    }
}

class Weapon
{
    private string $name;
    private int $damage;

    public function __construct(string $name, int $damage)
    {
        $this->name = $name;
        $this->damage = $damage;
    }

    public function getDamage(): int
    {
        return $this->damage;
    }
}

class Character
{
    private string $name;
    private Health $health;
    private ?Weapon $weapon;

    public function __construct(string $name)
    {
        $this->name = $name;
        $this->health = new Health();
        $this->weapon = null;
    }

    public function equip(Weapon $weapon): void
    {
        $this->weapon = $weapon;
    }

    public function attack(Character $target): void
    {
        if ($this->weapon) {
            $target->receiveDamage($this->weapon->getDamage());
        }
    }

    public function receiveDamage(int $amount): void
    {
        $this->health->decrease($amount);
    }

    public function getHealthStatus(): string
    {
        return "{$this->name}'s health: {$this->health->getCurrentHealth()}";
    }
}

$hero = new Character("Hero");
$enemy = new Character("Enemy");

$sword = new Weapon("Sword", 20);
$hero->equip($sword);

$hero->attack($enemy);
echo $enemy->getHealthStatus(); // Outputs: Enemy's health: 80
```

#### Pros of Composition:

1. Loose coupling
2. Flexibility
3. Selective reuse

#### Cons of Composition:

1. Can lead to many small classes
2. Might require more initial setup

### When to Use Each Approach

#### Use Inheritance When:

- There's a clear "is-a" relationship (e.g., a Dog is an Animal)
- You want to share implementation across multiple similar classes

```php
abstract class DatabaseConnection
{
    abstract public function connect(): void;

    public function query(string $sql): array
    {
        // Shared implementation for querying
    }
}

class MySQLConnection extends DatabaseConnection
{
    public function connect(): void
    {
        // MySQL-specific connection logic
    }
}

class PostgreSQLConnection extends DatabaseConnection
{
    public function connect(): void
    {
        // PostgreSQL-specific connection logic
    }
}
```

#### Use Composition When:

- You have "has-a" relationships (e.g., a Car has an Engine)
- You need to change behavior dynamically at runtime

```php
interface PaymentGateway
{
    public function processPayment(float $amount): bool;
}

class StripeGateway implements PaymentGateway
{
    public function processPayment(float $amount): bool
    {
        // Stripe-specific payment processing
        return true;
    }
}

class PayPalGateway implements PaymentGateway
{
    public function processPayment(float $amount): bool
    {
        // PayPal-specific payment processing
        return true;
    }
}

class Order
{
    private PaymentGateway $paymentGateway;

    public function setPaymentGateway(PaymentGateway $gateway): void
    {
        $this->paymentGateway = $gateway;
    }

    public function checkout(float $amount): bool
    {
        return $this->paymentGateway->processPayment($amount);
    }
}

$order = new Order();
$order->setPaymentGateway(new StripeGateway());
$order->checkout(100.00);

// Later, we can easily switch to a different payment gateway
$order->setPaymentGateway(new PayPalGateway());
$order->checkout(50.00);
```

In this last example, composition allows us to easily swap payment gateways without changing the `Order` class, demonstrating the flexibility of this approach.

By understanding these patterns and their appropriate use cases, you can write more maintainable, flexible, and robust PHP code. Remember, there's no one-size-fits-all solution - the best approach depends on your specific requirements and the problem you're solving.

## Best Practices in OOP

1. **Follow SOLID Principles**: Adhere to the SOLID principles to create more maintainable and scalable code.
2. **Use Meaningful Names**: Choose descriptive names for classes, methods, and variables that clearly convey their purpose.
3. **Keep Classes Focused**: Each class should have a single, well-defined responsibility.
4. **Favor Composition Over Inheritance**: Use composition to create more flexible and modular designs.
5. **Program to Interfaces**: Depend on abstractions rather than concrete implementations to increase flexibility.
6. **Use Design Patterns Judiciously**: Apply design patterns where they solve specific problems, but avoid overusing them.
7. **Write Clean and Readable Code**: Follow coding standards and maintain consistency throughout your codebase.
8. **Document Your Code**: Provide clear and concise documentation for your classes and methods.
9. **Practice Continuous Refactoring**: Regularly review and improve your code to maintain its quality and reduce technical debt.
10. **Write Unit Tests**: Create comprehensive unit tests to ensure the correctness of your classes and methods.

## Conclusion

Object-Oriented Programming is a powerful paradigm that offers numerous benefits for software development. By mastering the core concepts of classes, objects, abstraction, encapsulation, inheritance, and polymorphism, along with advanced principles like SOLID and design patterns, you can create more robust, maintainable, and scalable software systems.

As you continue to develop your OOP skills, remember that practice is key. Experiment with different design approaches, refactor existing code to apply OOP principles, and always strive to write clean, modular, and reusable code.

## What's Next?

1. Implement the concepts discussed in this guide in your next project.
2. Explore more advanced OOP topics such as design patterns and architectural patterns.
3. Practice refactoring existing code to better adhere to OOP principles.
4. Share your experiences, questions, or insights about OOP in the comments below.

Remember, mastering OOP is a journey. Keep learning, practicing, and refining your skills to become a more proficient and effective developer.
