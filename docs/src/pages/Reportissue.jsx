import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, MapPin, Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ReportIssue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    priority: "medium",
  });

  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [location, setLocation] = useState({
    lat: "",
    lng: "",
    road: "",
    area: "",
    city: "",
    state: "",
    country: "",
  });

  // 🔹 Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  // 🔹 Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Fetch live GPS location + reverse geocode
  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported.", variant: "destructive" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://civic-guard-production.up.railway.app/api/location/reverse?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();

          setLocation({
            lat: latitude,
            lng: longitude,
            road: data.address.road || "",
            area: data.address.suburb || data.address.city_district || "",
            city: data.address.city || data.address.town || "",
            state: data.address.state || "",
            country: data.address.country || "",
          });

          toast({ title: "Location fetched", description: "Live location fetched successfully!" });
        } catch (err) {
          console.error(err);
          toast({ title: "Error", description: "Failed to fetch address.", variant: "destructive" });
        }
      },
      (err) => {
        console.error(err);
        toast({ title: "Error", description: "Failed to get location.", variant: "destructive" });
      }
    );
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // prevent multiple clicks
    setIsSubmitting(true);

    const { title, type, description, priority } = formData;

    if (!title || !type || !description || (!location.lat && !location.road)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including location.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.token) {
      toast({
        title: "Unauthorized",
        description: "🔒 Please login/register to report an issue.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // 🔹 Normalize issue type
    let normalizedType = type.toLowerCase();
    switch (normalizedType) {
      case "pothole":
        normalizedType = "Pothole";
        break;
      case "garbage":
        normalizedType = "Garbage";
        break;
      case "broken infrastructure":
      case "infrastructure":
        normalizedType = "Broken Infrastructure";
        break;
      case "sewage":
        normalizedType = "Sewage";
        break;
      case "drains":
        normalizedType = "Drains";
        break;
      default:
        normalizedType = "Other";
        break;
    }

    // 🔹 Format location
    const formattedLocation = {
      street: location.road || "",
      area: location.area || "",
      suburb: location.suburb || "",
      city: location.city || "Mumbai",
      state: location.state || "",
      country: location.country || "India",
      coordinates: { lat: parseFloat(location.lat) || 0, lng: parseFloat(location.lng) || 0 },
      address: `${location.road}, ${location.area}, ${location.city}, ${location.state}, ${location.country}`,
    };

    try {
      const data = new FormData();
      data.append("title", title);
      data.append("type", normalizedType);
      data.append("description", description);
      data.append("priority", priority);
      data.append("location", JSON.stringify(formattedLocation));
      if (image) data.append("image", image);

      const response = await fetch(
        "https://civic-guard-production.up.railway.app/api/issues/report",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
          body: data,
        }
      );

      const resData = await response.json();

      if (response.ok) {
        toast({
          title: "✅ Issue Reported!",
          description: "Redirecting to your issues...",
        });

        // Reset form and redirect immediately
        setFormData({ title: "", type: "", description: "", priority: "medium" });
        setImage(null);
        setLocation({ lat: "", lng: "", road: "", area: "", city: "", state: "", country: "" });

        navigate("/issues", { replace: true });
      } else {
        toast({
          title: "Submission Failed",
          description: resData.error || "Something went wrong while submitting your issue.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Error",
        description: "⚠️ Something went wrong. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/issues")}
            className="hero-glow"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
              Report New Issue
            </h1>
            <p className="text-muted-foreground mt-2">
              Help improve your community by reporting civic issues
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="mission-card opacity-90 border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl gap-2">
                <MapPin className="text-primary" size={20} />
                Issue Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-background"
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Issue Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pothole">Pothole</SelectItem>
                      <SelectItem value="sewage">Sewage Issue</SelectItem>
                      <SelectItem value="drains">Blocked Drains</SelectItem>
                      <SelectItem value="garbage">Garbage Collection</SelectItem>
                      <SelectItem value="infrastructure">
                        Broken Infrastructure
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Button
                    type="button"
                    onClick={fetchLiveLocation}
                    className="bg-blue-500 text-white w-full mb-2"
                  >
                    Fetch My Current Location
                  </Button>
                  <Input
                    placeholder="Road / Street"
                    value={location.road}
                    onChange={(e) => setLocation({ ...location, road: e.target.value })}
                    className="bg-background mb-1"
                  />
                  <Input
                    placeholder="Area / Suburb"
                    value={location.area}
                    onChange={(e) => setLocation({ ...location, area: e.target.value })}
                    className="bg-background mb-1"
                  />
                  <Input
                    placeholder="City"
                    value={location.city}
                    onChange={(e) => setLocation({ ...location, city: e.target.value })}
                    className="bg-background mb-1"
                  />
                  <Input
                    placeholder="State"
                    value={location.state}
                    onChange={(e) => setLocation({ ...location, state: e.target.value })}
                    className="bg-background mb-1"
                  />
                  <Input
                    placeholder="Country"
                    value={location.country}
                    onChange={(e) => setLocation({ ...location, country: e.target.value })}
                    className="bg-background"
                  />
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the issue"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-background min-h-24"
                  />
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <Label>Upload Photos</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <Camera size={32} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload photos or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </label>
                  </div>
                  {image && (
                    <p className="text-sm text-muted-foreground mt-2">
                      ✅ {image.name} selected
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full hero-glow" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Upload size={18} className="mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload size={18} className="mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="mission-card opacity-90 border-0">
            <CardHeader>
              <CardTitle>
                <div className="text-2xl">Reporting Tips</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    title: "Be Specific",
                    desc: "Provide exact location details and clear description of the issue",
                  },
                  {
                    title: "Add Photos",
                    desc: "Pictures help authorities understand and prioritize issues",
                  },
                  {
                    title: "Safety First",
                    desc: "Mark urgent safety hazards as high priority",
                  },
                  {
                    title: "Track Progress",
                    desc: "Check the dashboard to see updates on your reported issues",
                  },
                ].map((tip, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Emergency Issues</h4>
                <p className="text-sm text-muted-foreground">
                  For urgent safety hazards that require immediate attention,
                  please also contact local emergency services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
