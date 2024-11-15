import 'package:flutter/material.dart';
import 'dart:async';

class MyTimer extends StatefulWidget
{
  const MyTimer({super.key});
  @override
  State<MyTimer> createState() => _MyTimerState();
}

class _MyTimerState extends State<MyTimer> 
  with TickerProviderStateMixin
{
  late AnimationController controller;
  Timer? timer;

  bool isTimerRunning = false;
  bool isTimerPaused = false;

  int startTimeInSeconds = 60;
  int remainTimeInSeconds = 60;

  void startTimer()
  {
    if(isTimerRunning) 
      {return;}
    isTimerRunning = true;
    timer = Timer.periodic(const Duration(seconds:1), (clock)
    {
      setState(() {
        if(remainTimeInSeconds <= 0) 
        {
          remainTimeInSeconds = 0;
          isTimerRunning = false;
          controller.stop();
          controller.value = 1;
          return;
        }
        controller
          ..forward(from: controller.value)
          ..repeat();
        remainTimeInSeconds--;
      });
    });
  }

  void pauseTimer()
  {
    setState(() {
      controller.stop();
      isTimerPaused = true;
      isTimerRunning = false;
    });
    timer?.cancel();
  }

  void resetTimer()
  {
    setState(() {
      controller.stop();
      controller.reset();
      remainTimeInSeconds = startTimeInSeconds;
      isTimerPaused = false;
      isTimerRunning = false;
    });
    timer?.cancel();
  }

  void setStartingTime(int time)
  {
    setState(() {
      startTimeInSeconds = time;
      remainTimeInSeconds = time;
      isTimerPaused = false;
      isTimerRunning = false;
    }); 
    timer?.cancel();
  }

  @override
  void initState() {
    controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: remainTimeInSeconds),
    )..addListener(() {
        setState(() {});
      });
    super.initState();
  }

  @override
  void dispose()
  {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(context)
  {
    int seconds = remainTimeInSeconds % 60;
    int minutes = (remainTimeInSeconds / 60).floor();
    return Scaffold
    (
      body: 
      Center
      (
        child :
        Stack(
          children:
          [
            Center(
              child: CircularProgressIndicator
              (
                      value: 1- controller.value,
                      semanticsLabel: 'Circular progress indicator',
                      strokeAlign: 35,
                      strokeWidth: 5,
              ),
            ),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}'),
                Row
                (
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: 
                  [
                    ElevatedButton(onPressed: startTimer, child: const Text('Start')),
                    ElevatedButton(onPressed: pauseTimer, child: const Text('Pause')),
                    ElevatedButton(onPressed: resetTimer, child: const Text('Reset')),
                  ],
                ),
              ],
            ),
          ]
        ),
      ),
    );
  }
}