
# Vision Verse

Vision Verse is an innovative web application that transforms static QR codes into dynamic, interactive gateways for augmented reality (AR) content. This project leverages AR and spatial computing technologies to blend the physical and digital worlds, enabling immersive learning, marketing, and interactive experiences.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment on Raspberry Pi Zero 2W](#deployment-on-raspberry-pi-zero-2w)
- [Research Background](#research-background)
- [License](#license)

## Features

- **Dynamic QR Codes:** Transform traditional QR codes into portals for limitless digital content.
- **Augmented Reality Integration:** Utilize A-Frame and AR.js to overlay digital content onto physical objects.
- **User Authentication:** Secure registration and login powered by Passport.js and passport‑local‑mongoose.
- **Product Management:** CRUD operations for products with image uploads and real-time reviews.
- **Secure Communication:** HTTPS server setup with SSL/TLS ensures secure data transmission.
- **Lightweight & Efficient:** Successfully runs on resource‑constrained hardware like the Raspberry Pi Zero 2W.

## Architecture

- **Backend:** Node.js with Express.js, using MongoDB with Mongoose for data persistence.
- **Frontend:** EJS templates render dynamic pages and AR content.
- **Security:** HTTPS, session management, and robust authentication mechanisms.
- **AR Frameworks:** A-Frame and AR.js deliver immersive AR experiences.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/vision-verse.git
   cd vision-verse
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   - Set your MongoDB connection string in the configuration.
   - Place your SSL certificate (`cert.pem`) and key (`key.pem`) in the project root.

4. **Generate SSL Certificates (if needed):**
   ```bash
   openssl req -nodes -new -x509 -keyout key.pem -out cert.pem
   ```

## Usage

1. **Start the Server:**
   ```bash
   node index.js
   ```
2. **Access the Application:**
   - Open your browser and navigate to `https://<your-system-ip>:3000`.

## Deployment on Raspberry Pi Zero 2W

Vision Verse is optimized to run efficiently on a Raspberry Pi Zero 2W, demonstrating its capability to operate on low-power, resource‑constrained hardware without any issues.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


