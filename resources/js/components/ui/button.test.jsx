import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './button';
import { describe, it, expect } from 'vitest';

describe('Button Component', () => {
    it('renders children correctly', () => {
        render(<Button>Click Me</Button>);
        const buttonElement = screen.getByText('Click Me');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.tagName).toBe('BUTTON');
    });

    it('renders with specific variant class', () => {
        render(<Button variant="destructive">Delete</Button>);
        const buttonElement = screen.getByText('Delete');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.className).toContain('bg-destructive');
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        const buttonElement = screen.getByText('Disabled');
        expect(buttonElement).toBeDisabled();
    });
});
