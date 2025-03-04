import http.server
import socketserver
import webbrowser
import os
import threading

# written primarily by CHATGPT because i am incredibly lazy 
# and don't want to learn these libraries

def run_server(address, port, index_file):
    # Change the working directory to the directory of the index file
    directory = os.path.dirname(os.path.abspath(index_file))
    os.chdir(directory)
    index_filename = os.path.basename(index_file)

    # Define a custom handler to serve the index file when the root URL is requested
    class CustomHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path == '/':
                self.path = '/' + index_filename
            elif self.path == '/shutdown':
                # Respond to the shutdown request
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b"Server shutting down...")
                # Shutdown the server in a new thread
                threading.Thread(target=self.server.shutdown).start()
                return
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        
    # Allow immediate reuse of the address after shutdown
    socketserver.TCPServer.allow_reuse_address = True

    # Create the server
    with socketserver.TCPServer((address, port), CustomHandler) as httpd:
        url = f"http://{address}:{port}"
        print(f"Serving {index_file} at {url}")
        # Open the default web browser
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()
        finally:
            httpd.server_close()
            print("Server closed and port released.")

run_server('127.0.0.1', 9493, './index.html')
