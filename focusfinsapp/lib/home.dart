import 'package:flutter/material.dart';
import 'package:focusfinsapp/reef.dart';
import 'package:focusfinsapp/timer.dart';
import 'package:focusfinsapp/store.dart';
// import 'package:focusfinsapp/settings.dart';

class MyHome extends StatefulWidget
{
  const MyHome({super.key});
  @override
  State<MyHome> createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> 
{

  int currentPage = 0;
  bool isNavigationDestination = true;
  
  // Unlocks and Locks the Navigation Destinations
  // So user cannot navigate while timer is going (ALSO STOPS FROM CRASH WHEN LEAVING TIMER)
  void navigationDestinationsTrue()
  {
    setState(() {
      isNavigationDestination = true;
    });
  }
  void navigationDestinationsFalse()
  {
    setState(() {
      isNavigationDestination = false;
    });
  }

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
        destinations: <Widget> [
          NavigationDestination
          (
            enabled: isNavigationDestination,
            icon: const Icon(Icons.anchor_rounded),
            label: 'Reef',
          ),
          NavigationDestination
          (
            enabled: isNavigationDestination,
            icon: const Icon(Icons.timer),
            label: 'Timer',
          ),
          NavigationDestination
          (
            enabled: isNavigationDestination,
            icon: const Icon(Icons.store),
            label: 'Bazaar',
          ),
          // NavigationDestination
          // (
          //   enabled: isNavigationDestination,
          //   icon: const Icon(Icons.settings),
          //   label: 'Settings',
          // ),
        ]
      ),
      body: 
      IndexedStack(
        children: [
          <Widget>
          [
            const MyReef(),
            MyTimer(navigationDestinationsTrue: navigationDestinationsTrue, navigationDestinationsFalse: navigationDestinationsFalse),
            const MyStore(),
            // const MySettings(),
          ][currentPage],
        ]
      ),
    );
  }
}