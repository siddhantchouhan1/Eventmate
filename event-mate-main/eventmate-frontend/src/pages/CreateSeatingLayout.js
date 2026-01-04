import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import EventService from '../services/eventService';
import toast from 'react-hot-toast';
import './CreateSeatingLayout.css';
import {
    FaChair, FaEraser, FaPaintBrush, FaSave, FaArrowLeft,
    FaPlus, FaTrash, FaUndo
} from 'react-icons/fa';

/**
 * Advanced Layout Editor
 * Features:
 * - Custom Grid Size
 * - Paint Tool: Assign Tiers
 * - Eraser Tool: Create Gaps (Aisles)
 * - Custom Tiers: Add/Edit Tiers with Colors/Prices
 */
const CreateSeatingLayout = () => {
    const navigate = useNavigate();

    // --- State ---
    const [name, setName] = useState('');
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(16);

    // Tools: 'paint' | 'erase'
    const [activeTool, setActiveTool] = useState('paint');

    // Tiers Data
    const [tiers, setTiers] = useState([
        { id: 't1', name: 'Standard', price: 100, color: '#34D399' },
        { id: 't2', name: 'VIP', price: 250, color: '#FCD34D' },
    ]);
    const [activeTierId, setActiveTierId] = useState('t1');

    // Grid Data: 2D Array of objects
    // { type: 'seat' | 'gap', tierId: string | null }
    const [grid, setGrid] = useState([]);

    const [loading, setLoading] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false); // For drag-painting

    // --- Init Grid ---
    useEffect(() => {
        initializeGrid(10, 16);
    }, []);

    const initializeGrid = (r, c) => {
        const newGrid = [];
        for (let i = 0; i < r; i++) {
            const row = [];
            for (let j = 0; j < c; j++) {
                row.push({ type: 'seat', tierId: 't1' }); // Default to Standard
            }
            newGrid.push(row);
        }
        setGrid(newGrid);
        setRows(r);
        setCols(c);
    };

    //Resize Grid (Preserve existing data if possible)
    const handleResize = (newR, newC) => {
        const newGrid = [];
        for (let i = 0; i < newR; i++) {
            const row = [];
            for (let j = 0; j < newC; j++) {
                if (grid[i] && grid[i][j]) {
                    row.push(grid[i][j]);
                } else {
                    row.push({ type: 'seat', tierId: 't1' });
                }
            }
            newGrid.push(row);
        }
        setGrid(newGrid);
        setRows(newR);
        setCols(newC);
    };

    // --- Interaction ---
    const handleCellAction = (r, c) => {
        const newGrid = [...grid];
        const cell = { ...newGrid[r][c] };

        if (activeTool === 'erase') {
            // Toggle Gap
            cell.type = cell.type === 'gap' ? 'seat' : 'gap';
        } else if (activeTool === 'paint') {
            // Assign Tier
            cell.type = 'seat'; // Ensure it's a seat
            cell.tierId = activeTierId;
        }

        newGrid[r][c] = cell;
        setGrid(newGrid);
    };

    const handleMouseDown = (r, c) => {
        setIsDrawing(true);
        handleCellAction(r, c);
    };

    const handleMouseEnter = (r, c) => {
        if (isDrawing) {
            handleCellAction(r, c);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    // --- Tier Management ---
    const addTier = () => {
        const id = `t${Date.now()}`;
        const newTier = { id, name: 'New Tier', price: 150, color: '#A78BFA' };
        setTiers([...tiers, newTier]);
        setActiveTierId(id);
    };

    const updateTier = (id, field, value) => {
        setTiers(tiers.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const removeTier = (id) => {
        if (tiers.length <= 1) {
            toast.error('At least one tier is required');
            return;
        }
        setTiers(tiers.filter(t => t.id !== id));
        if (activeTierId === id) setActiveTierId(tiers[0].id);
    };

    // --- Save ---
    const handleSave = async () => {
        if (!name) {
            toast.error('Please enter a layout name');
            return;
        }

        setLoading(true);
        try {
            // Transform Grid to optimized JSON config
            // We need to map the grid to a format the backend/frontend viewer handles.
            // Current Backend expects: name, totalRows, totalCols, Config (JSON)

            // Let's store the full grid state in the config JSON.
            // It allows full flexibility.
            const layoutConfig = {
                strategy: 'advanced', // Flag for frontend viewer to know how to parse
                tiers: tiers,
                grid: grid.map(row => row.map(cell => ({
                    t: cell.tierId,
                    g: cell.type === 'gap' ? 1 : 0
                })))
                // optimizing size: t = tierId, g = isGap
            };

            const payload = {
                name,
                totalRows: rows,
                totalCols: cols,
                config: JSON.stringify(layoutConfig)
            };

            await EventService.createSeatingLayout(payload);
            toast.success('Layout created successfully!');
            navigate('/admin/layouts');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save layout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout-editor-page" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {/* Header */}
            <div className="editor-header">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/layouts')} className="btn-icon">
                        <FaArrowLeft />
                    </button>
                    <h2>Design Layout</h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Layout Name (e.g. Screen 1)"
                        className="input-dark w-64 font-bold"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary" onClick={() => initializeGrid(10, 15)}>
                        <FaUndo /> Reset
                    </button>
                    <button className="btn-primary flex items-center gap-2" onClick={handleSave} disabled={loading}>
                        <FaSave /> {loading ? 'Saving...' : 'Save Layout'}
                    </button>
                </div>
            </div>

            <div className="editor-workspace">
                {/* Left Toolbar */}
                <div className="editor-toolbar">
                    {/* Tools */}
                    <div className="tool-section">
                        <div className="tool-section-title">Tools</div>
                        <div className="tools-grid">
                            <button
                                className={`tool-btn ${activeTool === 'paint' ? 'active' : ''}`}
                                onClick={() => setActiveTool('paint')}
                            >
                                <FaPaintBrush size={20} />
                                <span>Paint</span>
                            </button>
                            <button
                                className={`tool-btn ${activeTool === 'erase' ? 'active' : ''}`}
                                onClick={() => setActiveTool('erase')}
                            >
                                <FaEraser size={20} />
                                <span>Gap/Aisle</span>
                            </button>
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="tool-section">
                        <div className="tool-section-title">Dimensions</div>
                        <div className="flex gap-2">
                            <div>
                                <label className="text-xs text-muted">Rows</label>
                                <input type="number" value={rows}
                                    onChange={(e) => handleResize(parseInt(e.target.value) || 1, cols)}
                                    className="input-dark" min="1" max="50" />
                            </div>
                            <div>
                                <label className="text-xs text-muted">Cols</label>
                                <input type="number" value={cols}
                                    onChange={(e) => handleResize(rows, parseInt(e.target.value) || 1)}
                                    className="input-dark" min="1" max="50" />
                            </div>
                        </div>
                    </div>

                    {/* Tiers */}
                    <div className="tool-section">
                        <div className="flex justify-between items-center mb-2">
                            <div className="tool-section-title mb-0">Tiers</div>
                            <button onClick={addTier} className="text-xs text-primary hover:text-white">
                                <FaPlus /> Add
                            </button>
                        </div>
                        <div className="tiers-list">
                            {tiers.map(tier => (
                                <div
                                    key={tier.id}
                                    className={`tier-item ${activeTierId === tier.id ? 'active' : ''}`}
                                    onClick={() => { setActiveTierId(tier.id); setActiveTool('paint'); }}
                                >
                                    <div
                                        className="tier-color-dot"
                                        style={{ backgroundColor: tier.color }}
                                    ></div>
                                    <div className="tier-info">
                                        <input
                                            value={tier.name}
                                            onChange={(e) => updateTier(tier.id, 'name', e.target.value)}
                                            className="bg-transparent border-none text-white text-sm w-full focus:outline-none"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex items-center gap-1 text-xs text-muted">
                                            <span>₹</span>
                                            <input
                                                type="number"
                                                value={tier.price}
                                                onChange={(e) => updateTier(tier.id, 'price', parseFloat(e.target.value))}
                                                className="bg-transparent border-none text-muted w-12 p-0 focus:outline-none"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                    {tiers.length > 1 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeTier(tier.id); }}
                                            className="text-xs text-red-500 opacity-50 hover:opacity-100"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Canvas */}
                <div className="editor-canvas-container">
                    <div className="canvas-toolbar">
                        <div className="text-sm text-muted">
                            {activeTool === 'paint' ? 'Click or drag to assign seats.' : 'Click seats to create gaps.'}
                        </div>
                    </div>

                    <div className="canvas-scroll-area">
                        <div className="seat-grid">
                            {grid.map((row, rIndex) => (
                                <div key={rIndex} className="grid-row">
                                    <div className="row-handle">{String.fromCharCode(65 + rIndex)}</div>
                                    {row.map((cell, cIndex) => {
                                        // Resolve Tier
                                        const tier = tiers.find(t => t.id === cell.tierId) || tiers[0];
                                        const isGap = cell.type === 'gap';

                                        return (
                                            <div
                                                key={`${rIndex}-${cIndex}`}
                                                className={`seat-cell ${isGap ? 'gap' : ''}`}
                                                style={{
                                                    backgroundColor: isGap ? 'transparent' : tier.color,
                                                    opacity: isGap ? 1 : 1
                                                }}
                                                onMouseDown={() => handleMouseDown(rIndex, cIndex)}
                                                onMouseEnter={() => handleMouseEnter(rIndex, cIndex)}
                                                title={`Row ${rIndex + 1} Col ${cIndex + 1}`}
                                            >
                                                {!isGap && <FaChair size={14} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSeatingLayout;