import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';

class MyStore extends StatefulWidget
{
  const MyStore({super.key});
  @override
  State<MyStore> createState() => _MyStoreState();
}

class _MyStoreState extends State<MyStore> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold
    (
      body: 
        Center
        (
          child: Card
          (
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: 
              [
                Bubbles(),
                StoreElement(cost: 0, name: 'Values'),
                StoreElement(cost: 10, name: 'Test'),
                StoreElement(cost: 20, name: 'IDK'),
                StoreElement(cost: 58, name: 'TestingOver'),
                StoreElement(cost: 120, name: 'Nothing'),
                StoreElement(cost: 240, name: 'Random'),
                StoreElement(cost: 300, name: 'Im Out of Names'),
                StoreElement(cost: 500, name: 'I got Nothing'),
              ],
            )
          )
        )
    );
  }
}

// Bubbles Icon and Number
class Bubbles extends StatelessWidget {
  const Bubbles
  ({
    super.key,
  });
  @override
  Widget build(BuildContext context) {
    return Card
    (
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon
          (
            Icons.bubble_chart_outlined,
          ),
          Text('$curBubbles'),
        ]
      )
    );
  }
}

// Store Element
class StoreElement extends StatelessWidget {
  const StoreElement
  ({
    super.key,
    required this.cost,
    required this.name,
  });
  final int cost;
  final String name;

  void buyCoral() async
  {
    // I have no clue lmao
    // decBubbles(cost);
    // addCoral();
  }

  @override
  Widget build(BuildContext context) {
    if(curBubbles < cost){
      return Container();
    }
    return Card(
      child: Row
      (
        mainAxisAlignment: MainAxisAlignment.center,
        children:
        [
          Text(name),
          ElevatedButton
          (
            onPressed: buyCoral, 
            child: Row
            (
              children:
              [
                Text('Cost: $cost'), 
                bubbleIcon,
              ]
            )
          )
        ]
      ),
    );
  }
}