import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';

const router = Router();

// Get all trips for user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Get single trip
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { data: trip, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error) throw error;

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Create trip
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { destination, startDate, endDate, budget, travelers, preferences, itinerary, expenses } = req.body;

    const { data: trip, error } = await supabase
      .from('trips')
      .insert([{
        user_id: req.userId,
        destination,
        start_date: startDate,
        end_date: endDate,
        budget,
        travelers,
        preferences,
        itinerary,
        expenses: expenses || []
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ trip });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Update trip
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { destination, startDate, endDate, budget, travelers, preferences, itinerary, expenses } = req.body;

    const { data: trip, error } = await supabase
      .from('trips')
      .update({
        destination,
        start_date: startDate,
        end_date: endDate,
        budget,
        travelers,
        preferences,
        itinerary,
        expenses
      })
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ trip });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Delete trip
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

export default router;

