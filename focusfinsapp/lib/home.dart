import 'package:flutter/material.dart';
import 'package:focusfinsapp/reef.dart';
import 'package:focusfinsapp/timer.dart';
import 'package:focusfinsapp/store.dart';
import 'package:focusfinsapp/settings.dart';

class MyHome extends StatefulWidget
{
  const MyHome({super.key});
  @override
  State<MyHome> createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> 
{

  int currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      
      bottomNavigationBar: NavigationBar
      (
        onDestinationSelected: (int index)
        {
          setState(() {
            currentPage = index;
          });
        },
        selectedIndex: currentPage,
        destinations: const <Widget> [
          NavigationDestination
          (
            icon: Icon(Icons.anchor_rounded),
            label: 'Reef',
          ),
          NavigationDestination
          (
            icon: Icon(Icons.timer),
            label: 'Timer',
          ),
          NavigationDestination
          (
            icon: Icon(Icons.store),
            label: 'Bazaar',
          ),
          NavigationDestination
          (
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ]
      ),
      body: 
      IndexedStack(
        children: [
          <Widget>
          [
            const MyReef(),
            const MyTimer(),
            const MyStore(),
            const MySettings(),
          ][currentPage],
        ]
      ),
    );
  }
}