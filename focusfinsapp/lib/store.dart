import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';

// Coral names and prices
const List<String> coralNames = [
  'Seaweed', 'Green Leafy Coral', 'Bubble Wisps', 'Golden Sunburst', 'Rosy Ripple', 'Glowlet', 'Azure Bloom',
  'Ocean Mist Wisp', 'Saphire Spark', 'Part the Blue Sea', 'Bubble Bulbs', 'Ocean Fern', 'Royal Coral',
  'Blueberry Spark', 'Aqua Crown', 'Lemon Loop', 'Mini Wavelet', 'Amethyst Bloom', 'Solar Blossom', 'Coral Seaweed',
  'Xenia Coral', 'Amber Waves'
];

const List<int> coralPrices = [
  100, 505, 150, 250, 250, 100, 180, 220, 30, 35, 800, 300, 280, 100, 400, 600,
  105, 50, 450, 170, 300, 100
];

class MyStore extends StatefulWidget {
  const MyStore({super.key});
  @override
  State<MyStore> createState() => _MyStoreState();
}

class _MyStoreState extends State<MyStore> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/blue.png'), // Background image
            fit: BoxFit.cover, // Ensure it covers the entire background
          ),
        ),
        child: Center(
          child: Container(
            width: 350.0, // Set the desired width
            height: 700.0, // Set the desired height
            padding: const EdgeInsets.all(16.0), // Padding inside the box
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2), // Slightly transparent white
              borderRadius: BorderRadius.circular(12.0), // Rounded corners
            ),
            child: Column(
              children: [
                const Bubbles(),
                const SizedBox(height: 8), // Reduced spacing between title and items
                Expanded(
                  child: ListView.builder(
                    itemCount: coralNames.length,
                    itemBuilder: (context, index) {
                      return StoreElement(
                        name: coralNames[index],
                        cost: coralPrices[index],
                        imagePath: 'assets/images/$index.png', // Updated to start from 0
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Bubbles Icon and Number
class Bubbles extends StatelessWidget {
  const Bubbles({super.key});
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
          Icons.bubble_chart_outlined,
          size: 36, // Larger icon size
          color: Colors.white, // Icon color matches text
        ),
        const SizedBox(width: 8), // Spacing between the icon and text
        Text(
          'Bubble Bank: $curBubbles 🫧', // Bubble emoji after the number
          style: const TextStyle(
            fontSize: 24, // Larger font size
            fontWeight: FontWeight.bold, // Bold text
            color: Colors.white, // White text color
            shadows: [
              Shadow(
                offset: Offset(2.0, 2.0), // Offset for the shadow
                blurRadius: 4.0, // Blur effect for the shadow
                color: Color.fromARGB(71, 0, 0, 0), // Shadow color
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// Store Element
class StoreElement extends StatelessWidget {
  const StoreElement({
    super.key,
    required this.cost,
    required this.name,
    required this.imagePath,
  });
  final int cost;
  final String name;
  final String imagePath;

  void buyCoral() async {
    // Logic for purchasing coral
    if (curBubbles >= cost) {
      decBubbles(cost); // Deduct bubbles
      addCoralToInventory(name); // Add coral to user's inventory
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      color: const Color.fromARGB(233, 255, 255, 255), // White background for the store item
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      child: ListTile(
        leading: Image.asset(
          imagePath,
          width: 50,
          height: 50,
          fit: BoxFit.cover,
        ),
        title: Text(
          name,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Color(0xFF242531), // Text color #242531
          ),
        ),
        subtitle: Row(
          children: [
            Text(
              'Cost: $cost',
              style: const TextStyle(color: Color(0xFF242531)), // Text color #242531
            ),
            const SizedBox(width: 4),
            bubbleIcon,
          ],
        ),
        trailing: ElevatedButton(
          onPressed: curBubbles >= cost ? buyCoral : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF242531), // Button background color
            foregroundColor: Colors.white, // Button text color
          ),
          child: const Text('Buy'),
        ),
      ),
    );
  }

  void addCoralToInventory(String name) {}
}
