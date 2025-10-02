# Digital Communication System Simulator

A comprehensive simulator for digital communication systems, providing tools for modeling, analysis, and visualization of various communication techniques and channel models.

## Overview

This project implements a digital communication system simulator that allows users to design, analyze, and evaluate different communication system components and architectures. It provides a framework for understanding the principles of digital communications through practical simulations.

## Features

- **Modulation Techniques**: Supports various digital modulation schemes (e.g., BPSK, QPSK, QAM, FSK)
- **Channel Models**: Implements different channel models including AWGN, Rayleigh fading, and multipath channels
- **Error Control Coding**: Includes tools for implementing and testing various error correction codes
- **Performance Analysis**: Provides BER (Bit Error Rate) calculation and visualization tools
- **Signal Processing**: Implements filtering, synchronization, and equalization techniques
- **Visualization**: Real-time and post-processing visualization of signals, constellations, and system performance metrics

## Installation

```bash
# Clone the repository
git clone https://github.com/rupeshv2121/digital-communication-system-simulator.git

# Change directory
cd digital-communication-system-simulator

# Install required dependencies
pip install -r requirements.txt
```

## Usage

```python
# Example code demonstrating basic usage of the simulator
from digicommsim import Channel, Modulator, ErrorAnalyzer

# Create a BPSK modulator
mod = Modulator(scheme='BPSK', symbol_rate=1000)

# Create an AWGN channel with specific SNR
channel = Channel(type='AWGN', snr_db=10)

# Generate random bits
bit_stream = mod.generate_random_bits(1000)

# Modulate bits
symbols = mod.modulate(bit_stream)

# Pass through channel
received_symbols = channel.transmit(symbols)

# Demodulate
received_bits = mod.demodulate(received_symbols)

# Analyze performance
analyzer = ErrorAnalyzer()
ber = analyzer.calculate_ber(bit_stream, received_bits)
print(f"Bit Error Rate: {ber}")
```

## Library Descriptions

### Core Libraries

- **SignalProcessing**: Implements essential signal processing operations such as filtering, windowing, and transformations
- **Modulation**: Provides classes and functions for digital modulation and demodulation techniques
- **Channel**: Models various communication channels and their effects on transmitted signals
- **ErrorControl**: Implements error detection and correction coding schemes
- **Synchronization**: Provides tools for carrier and symbol timing recovery
- **Visualization**: Offers plotting and visualization capabilities for signals and performance metrics

### Utility Libraries

- **BitOperations**: Utilities for bit manipulation and binary data processing
- **MathUtils**: Mathematical functions commonly used in digital communications
- **ConfigManager**: Handles configuration and parameter management for simulations
- **FileIO**: Manages data import/export and simulation result storage

## Key Concepts and Definitions

- **Digital Modulation**: The process of converting digital information into analog signals suitable for transmission
- **Channel Coding**: Techniques to add redundancy to transmitted data for error detection and correction
- **Signal-to-Noise Ratio (SNR)**: The ratio of signal power to noise power, often expressed in decibels (dB)
- **Bit Error Rate (BER)**: The ratio of erroneously received bits to the total number of transmitted bits
- **Constellation Diagram**: A representation of a signal modulated by a digital modulation scheme in complex plane
- **Intersymbol Interference (ISI)**: Distortion affecting a signal where one symbol interferes with subsequent symbols
- **Multipath Fading**: Signal distortion caused by signals arriving at the receiver through different paths with different delays
- **Equalization**: Techniques to mitigate ISI and other channel impairments

## Examples

The `examples/` directory contains various demonstration scenarios:

- Basic modulation and demodulation
- Channel effects visualization
- Error correction performance evaluation
- Complete communication system simulations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@rupeshv2121](https://github.com/rupeshv2121)

Project Link:(https://digital-communication-system-simulator-app.vercel.app/)