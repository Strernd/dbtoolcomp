CREATE TABLE `customers` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` integer PRIMARY KEY NOT NULL,
	`orderId` integer NOT NULL,
	`productCode` text NOT NULL,
	`quantity` integer NOT NULL,
	`unitPrice` integer NOT NULL,
	FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY NOT NULL,
	`customerId` integer NOT NULL,
	`orderDate` text NOT NULL,
	FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);