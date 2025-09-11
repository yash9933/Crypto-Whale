import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { calculateAllocation, recordTransaction } from '../services/portfolioService';
import { placeOrder } from '../services/alpacaService';
import { Portfolio } from '../types/database';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from './ui/use-toast';

interface TradeAllocatorProps {
  portfolio: Portfolio;
  onReallocationComplete: () => void;
}

export function TradeAllocator({ portfolio, onReallocationComplete }: TradeAllocatorProps) {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  
  // Get current allocation
  const currentAllocation = calculateAllocation(portfolio);
  
  // State for the slider
  const [targetAllocation, setTargetAllocation] = useState(currentAllocation.tradfi);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate the difference between current and target allocation
  const allocationDifference = targetAllocation - currentAllocation.tradfi;
  
  // Calculate the amount to move
  const calculateAmountToMove = () => {
    if (allocationDifference === 0) return 0;
    
    // Calculate the dollar amount based on the percentage change
    const amountToMove = (Math.abs(allocationDifference) / 100) * portfolio.totalEquityUSD;
    return amountToMove;
  };
  
  const amountToMove = calculateAmountToMove();
  
  // Determine the direction of the reallocation
  const isMovingToTradfi = allocationDifference > 0;
  
  // Handle reallocation
  const handleReallocate = async () => {
    if (!currentUser || !userProfile || amountToMove === 0) return;
    
    try {
      setIsSubmitting(true);
      
      // Record the transaction
      const from = isMovingToTradfi ? 'phantom_wallet' : 'alpaca';
      const to = isMovingToTradfi ? 'alpaca' : 'phantom_wallet';
      
      const transactionId = await recordTransaction(
        currentUser.uid,
        from,
        to,
        amountToMove
      );
      
      // Simulate the trade execution
      // In a real app, this would trigger actual trades
      
      if (isMovingToTradfi) {
        // Simulate selling crypto and buying stocks
        console.log(`Selling $${amountToMove} worth of crypto assets`);
        // In a real app, you would execute a swap to USDC and transfer to Alpaca
        
        // Simulate buying stocks with the proceeds
        if (userProfile.alpacaLinked) {
          console.log(`Buying $${amountToMove} worth of stocks`);
          // In a real app, you would use the Alpaca API to place orders
          await placeOrder('mock-api-key', 'mock-api-secret', 'SPY', Math.floor(amountToMove / 400), 'buy');
        }
      } else {
        // Simulate selling stocks and buying crypto
        if (userProfile.alpacaLinked) {
          console.log(`Selling $${amountToMove} worth of stocks`);
          // In a real app, you would use the Alpaca API to place orders
          await placeOrder('mock-api-key', 'mock-api-secret', 'AAPL', Math.floor(amountToMove / 175), 'sell');
        }
        
        // Simulate buying crypto with the proceeds
        console.log(`Buying $${amountToMove} worth of crypto assets`);
        // In a real app, you would execute a transfer to the wallet and swap from USDC
      }
      
      // Show success message
      toast({
        title: "Reallocation Initiated",
        description: `Moving $${amountToMove.toFixed(2)} from ${from} to ${to}`,
      });
      
      // Refresh the portfolio data
      onReallocationComplete();
      
    } catch (error) {
      console.error('Error reallocating portfolio:', error);
      toast({
        title: "Reallocation Failed",
        description: "There was an error reallocating your portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reallocate Your Portfolio</CardTitle>
        <CardDescription>Adjust the slider to change your allocation between TradFi and DeFi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>DeFi: {100 - targetAllocation}%</span>
            <span>TradFi: {targetAllocation}%</span>
          </div>
          <Slider
            value={[targetAllocation]}
            onValueChange={(values) => setTargetAllocation(values[0])}
            min={0}
            max={100}
            step={1}
            className="my-4"
          />
        </div>
        
        {allocationDifference !== 0 && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-medium mb-2">Reallocation Summary</h4>
            <p className="text-sm mb-1">
              {isMovingToTradfi 
                ? `Moving ${formatCurrency(amountToMove)} from DeFi to TradFi` 
                : `Moving ${formatCurrency(amountToMove)} from TradFi to DeFi`}
            </p>
            <p className="text-sm text-gray-500">
              {isMovingToTradfi 
                ? "This will sell crypto assets and buy stocks" 
                : "This will sell stocks and buy crypto assets"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full" 
              disabled={allocationDifference === 0 || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Reallocate Funds"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Reallocation</AlertDialogTitle>
              <AlertDialogDescription>
                {isMovingToTradfi 
                  ? `You are about to move ${formatCurrency(amountToMove)} from your crypto wallet to your brokerage account.` 
                  : `You are about to move ${formatCurrency(amountToMove)} from your brokerage account to your crypto wallet.`}
                <br /><br />
                This is a simulated transaction for the MVP. No actual funds will be moved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReallocate}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
