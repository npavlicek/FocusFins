import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_plus/webview_flutter_plus.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/services.dart';

final storage = new FlutterSecureStorage();

class MyReef extends StatefulWidget {
  const MyReef({super.key});
  @override
  State<MyReef> createState() => _MyReefState();
}

class _MyReefState extends State<MyReef> {
  final WebViewControllerPlus _controller = WebViewControllerPlus();

  void randomFunction() async {
    await getBubbles();
  }

  @override
  Widget build(BuildContext context) {
    _controller.setJavaScriptMode(JavaScriptMode.unrestricted);
    _controller
        .loadFlutterAssetServer('assets/index.html')
        .whenComplete(() async {
      String js = await rootBundle.loadString('assets/assets/bundle.js');
      _controller.runJavaScript(js).whenComplete(() {
        storage.read(key: 'token').then((token) {
          storage.read(key: 'id').then((id) {
            if (token != null && id != null) {
              _controller
                  .runJavaScript('initApp("$token", "$id");')
                  .onError((err, stacktrace) {
                if (err != null) {
                  print(err);
                }
              });
            }
          });
        });
      }).onError((err, stacktrace) {
        if (err != null) {
          print(err);
        }
      });
    }).onError((error, stacktrace) {
      if (error != null) {
        print(error);
      }
    });
    return WebViewWidget(controller: _controller);
  }
}
