
import { useTransactionStore, useWalletStore } from "@/store/store";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Transaction, TransactionType } from "@/types";
import { ArrowDown, ArrowUp, ExternalLink, Factory, SendHorizonal } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";

const TransactionFeed = () => {
  const { transactions } = useTransactionStore();
  const { wallets, activeWallet } = useWalletStore();
  const { isConnected, isConnecting, connect, disconnect } = useWebSocket();
  const feedRef = useRef<HTMLDivElement>(null);
  
  // Filter transactions based on the active wallet
  const filteredTransactions = activeWallet
    ? transactions.filter((tx) => tx.walletAddress === activeWallet)
    : transactions;
    
  // Auto scroll to bottom when new transactions arrive
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [filteredTransactions.length]);
  
  // Get transaction icon based on type
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "buy":
        return <ArrowDown className="h-4 w-4 text-success" />;
      case "sell":
        return <ArrowUp className="h-4 w-4 text-danger" />;
      case "mint":
        return <Factory className="h-4 w-4 text-primary" />;
      case "transfer":
        return <SendHorizonal className="h-4 w-4 text-warning" />;
    }
  };
  
  // Get transaction background color based on type
  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case "buy":
        return "bg-success/5 border-success/20";
      case "sell":
        return "bg-danger/5 border-danger/20";
      case "mint":
        return "bg-primary/5 border-primary/20";
      case "transfer":
        return "bg-warning/5 border-warning/20";
      default:
        return "";
    }
  };
  
  // Get transaction label
  const getTransactionLabel = (type: TransactionType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const handleConnectClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };
  
  const renderTransaction = (transaction: Transaction) => {
    const wallet = wallets.find((w) => w.address === transaction.walletAddress);
    
    return (
      <Card
        key={transaction.id}
        className={cn(
          "p-3 mb-3 transition-all",
          getTransactionColor(transaction.type)
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-full bg-background">
              {getTransactionIcon(transaction.type)}
            </span>
            <div>
              <p className="font-semibold text-sm flex items-center">
                <span>{getTransactionLabel(transaction.type)}</span>
                <span className="mx-1">•</span>
                <span>{transaction.tokenSymbol}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {wallet?.nickname || 
                  `${transaction.walletAddress.substring(0, 4)}...${transaction.walletAddress.substring(transaction.walletAddress.length - 4)}`}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-semibold">
              {transaction.amount.toFixed(2)} {transaction.tokenSymbol}
            </p>
            {transaction.usdValue && (
              <p className="text-xs text-muted-foreground">
                ${transaction.usdValue.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{formatDistanceToNow(transaction.timestamp, { addSuffix: true })}</span>
          {transaction.solscanLink && (
            <a
              href={transaction.solscanLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-foreground"
            >
              View on Solscan
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </div>
      </Card>
    );
  };
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {activeWallet
            ? `Transactions for ${
                wallets.find((w) => w.address === activeWallet)?.nickname || 
                `${activeWallet.substring(0, 6)}...${activeWallet.substring(activeWallet.length - 4)}`
              }`
            : "All Transactions"}
        </h2>
        <Button
          variant={isConnected ? "outline" : "default"}
          size="sm"
          onClick={handleConnectClick}
          disabled={isConnecting}
        >
          {isConnecting
            ? "Connecting..."
            : isConnected
            ? "Disconnect"
            : "Connect"}
        </Button>
      </div>
      
      <div 
        ref={feedRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <SendHorizonal className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No transactions yet</h3>
            <p className="text-sm text-muted-foreground">
              {wallets.length === 0
                ? "Add a wallet to start tracking transactions"
                : !isConnected
                ? "Connect to the transaction stream to start receiving updates"
                : "Waiting for new transactions..."}
            </p>
          </div>
        )}
        
        {filteredTransactions.map(renderTransaction)}
      </div>
    </div>
  );
};

export default TransactionFeed;
