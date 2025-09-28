import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const KPICard = ({ title, value, icon: Icon, description, variant = "default" }) => {
  const variantStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning", 
    destructive: "text-destructive"
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${variantStyles[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;