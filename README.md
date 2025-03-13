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
