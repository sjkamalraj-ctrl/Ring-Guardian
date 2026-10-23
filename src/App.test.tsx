import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders Ring Guardian brand and dashboard without crashing', () => {
    render(<App />);
    expect(screen.getByText('Ring Guardian')).toBeDefined();
    expect(screen.getByText('Home Safety Hub')).toBeDefined();
    expect(screen.getByText("Mom's Home — Overview")).toBeDefined();
  });

  it('navigates through all views without errors', () => {
    render(<App />);

    // Live View
    fireEvent.click(screen.getAllByRole('button', { name: /Live View/i })[0]);
    expect(screen.getByText('Real-time camera feeds')).toBeDefined();

    // Access Control
    fireEvent.click(screen.getAllByRole('button', { name: /Access Control/i })[0]);
    expect(screen.getByText('Smart lock & entry management')).toBeDefined();

    // Caretaker Mode
    fireEvent.click(screen.getAllByRole('button', { name: /Caretaker Mode/i })[0]);
    expect(screen.getByText('Wellness monitoring & alerts')).toBeDefined();

    // Event Log
    fireEvent.click(screen.getAllByRole('button', { name: /Event Log/i })[0]);
    expect(screen.getByText('Motion, doorbell & access history')).toBeDefined();

    // Devices
    fireEvent.click(screen.getAllByRole('button', { name: /Devices/i })[0]);
    expect(screen.getByText('All Ring devices in this location')).toBeDefined();
  });
});

