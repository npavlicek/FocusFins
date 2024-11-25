import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';
import 'dart:async';

class MyTimer extends StatefulWidget {
  const MyTimer({super.key});
  @override
  State<MyTimer> createState() => _MyTimerState();
}

class _MyTimerState extends State<MyTimer> with TickerProviderStateMixin {
  TimeOfDay? time = const TimeOfDay(hour: 0, minute: 20);
  late AnimationController controller;
  Timer? timer;

  bool isTimerRunning = false;
  bool isTimerPaused = false;
  bool onBreak = false;

  int hour = 0;
  int minute = 25;
  int startTimeInSeconds = 1500; // Default 25 minutes in seconds
  int remainTimeInSeconds = 1500;

  int timeTillBubble = 0;
  int secondsForBubble = 30;
  int incBubbleAmount = 1;

  int bubbleAmount = 0;

  String clickString = 'Start';

  void clickTimer() {
    if (isTimerRunning) {
      clickString = 'Start';
      pauseTimer();
    } else {
      clickString = 'Pause';
      startTimer();
    }
  }

  void startTimer() {
    isTimerRunning = true;
    timer = Timer.periodic(const Duration(seconds: 1), (clock) {
      setState(() {
        if (remainTimeInSeconds <= 0) {
          remainTimeInSeconds = 0;
          isTimerRunning = false;
          controller.stop();
          timer?.cancel();
          controller.value = 1;
          incBubbleFunction();
          return;
        }
        timeTillBubble += incBubbleAmount;
        if (timeTillBubble >= secondsForBubble) {
          timeTillBubble -= secondsForBubble;
          bubbleAmount++;
        }
        controller
          ..forward(from: controller.value)
          ..repeat();
        remainTimeInSeconds--;
      });
    });
  }

  void pauseTimer() {
    setState(() {
      controller.stop();
      isTimerPaused = true;
      isTimerRunning = false;
    });
    timer?.cancel();
  }

  void resetTimer() {
    setState(() {
      clickString = 'Start';
      controller.stop();
      remainTimeInSeconds = startTimeInSeconds;
      controller.duration = Duration(seconds: remainTimeInSeconds);
      controller.reset();
      isTimerPaused = false;
      isTimerRunning = false;
      timeTillBubble = 0;
    });
    timer?.cancel();
  }

  void setStartingTime() {
    if (time?.hour != null || time?.minute != null) {
      hour = int.parse('${time?.hour}');
      minute = int.parse('${time?.minute}');
    } else {
      return;
    }
    setState(() {
      startTimeInSeconds = (hour * 3600) + (minute * 60);
      resetTimer();
    });
  }

  void incBubbleFunction() async {
    bool canInc = await incBubbles(bubbleAmount);
    if (canInc) {
      curBubbles += bubbleAmount;
    } else {
      'error';
    }
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
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    int seconds = remainTimeInSeconds % 60;
    int minutes = (remainTimeInSeconds / 60).floor();

    void changeTime() async {
      time = await showTimePicker(
        context: context,
        initialTime: TimeOfDay(hour: hour, minute: minute),
        initialEntryMode: TimePickerEntryMode.inputOnly,
        builder: (BuildContext context, Widget? child) {
          return MediaQuery(
            data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: true),
            child: child!,
          );
        },
      );
      setStartingTime();
    }

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/blue.png'), // Path to the background image
            fit: BoxFit.cover, // Cover the entire screen
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Timer display with circular progress indicator
              Stack(
                alignment: Alignment.center,
                children: [
                  CircularProgressIndicator(
                    value: 1 - controller.value,
                    semanticsLabel: 'Circular progress indicator',
                    strokeAlign: 35,
                    strokeWidth: 5,
                  ),
                  Text(
                    '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white, // White text for visibility
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 100), // Space between timer and buttons
              // Buttons under the timer
              Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ElevatedButton(
                        onPressed: clickTimer,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white, // Button background
                          foregroundColor: Colors.black, // Button text color
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8), // Rounded corners
                          ),
                        ),
                        child: Text(clickString),
                      ),
                      const SizedBox(width: 10), // Space between buttons
                      ElevatedButton(
                        onPressed: changeTime,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white, // Button background
                          foregroundColor: Colors.black, // Button text color
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8), // Rounded corners
                          ),
                        ),
                        child: const Text('Set'),
                      ),
                      const SizedBox(width: 10), // Space between buttons
                      ElevatedButton(
                        onPressed: resetTimer,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white, // Button background
                          foregroundColor: Colors.black, // Button text color
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8), // Rounded corners
                          ),
                        ),
                        child: const Text('Reset'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10), // Space between rows
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        onBreak = !onBreak;
                        remainTimeInSeconds = onBreak ? 300 : 1500; // Toggle between 5 minutes and 25 minutes
                        controller.duration = Duration(seconds: remainTimeInSeconds);
                        controller.reset();
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color.fromARGB(255, 54, 103, 110), // Button background
                      foregroundColor: Colors.white, // Button text color
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8), // Rounded corners
                      ),
                    ),
                    child: Text(onBreak ? 'Back to Focus' : 'Take a Break'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
