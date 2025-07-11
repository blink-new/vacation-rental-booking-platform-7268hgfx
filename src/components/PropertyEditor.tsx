import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface PropertyEditorProps {
  onSave?: (property: Record<string, unknown>) => void
  initialData?: Record<string, unknown>
}

const PropertyEditor = ({ onSave, initialData }: PropertyEditorProps) => {
  const [property, setProperty] = useState({
    title: initialData?.title || '',
    location: initialData?.location || '',
    price: initialData?.price?.toString() || '',
    description: initialData?.description || '',
    guests: initialData?.guests?.toString() || '6',
    bedrooms: initialData?.bedrooms?.toString() || '3',
    bathrooms: initialData?.bathrooms?.toString() || '2',
    size: initialData?.size?.toString() || '140',
    status: initialData?.status || 'active',
    images: initialData?.images || [],
    features: initialData?.features || [],
    amenities: initialData?.amenities || [],
    houseRules: initialData?.houseRules || {
      checkIn: '15:00',
      checkOut: '11:00',
      maxGuests: 6,
      smokingAllowed: false,
      petsAllowed: false
    },
    safety: initialData?.safety || ['Kohlenmonoxidmelder', 'Rauchmelder'],
    cancellation: initialData?.cancellation || ''
  })

  const [newImage, setNewImage] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newAmenity, setNewAmenity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    if (!property.title || !property.location || !property.price) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus')
      return
    }

    setIsSubmitting(true)
    try {
      const propertyData = {
        ...property,
        price: parseInt(property.price),
        guests: parseInt(property.guests),
        bedrooms: parseInt(property.bedrooms),
        bathrooms: parseInt(property.bathrooms),
        size: parseInt(property.size),
        houseRules: {
          ...property.houseRules,
          maxGuests: parseInt(property.guests)
        }
      }

      onSave?.(propertyData)
      toast.success('Unterkunft erfolgreich gespeichert')
    } catch (error) {
      console.error('Error saving property:', error)
      toast.error('Fehler beim Speichern der Unterkunft')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addImage = () => {
    if (newImage.trim()) {
      setProperty(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage('')
    }
  }

  const removeImage = (index: number) => {
    setProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setProperty(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setProperty(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setProperty(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }))
      setNewAmenity('')
    }
  }

  const removeAmenity = (index: number) => {
    setProperty(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grundinformationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={property.title}
                onChange={(e) => setProperty(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ferienhaus Titel"
              />
            </div>
            <div>
              <Label htmlFor="location">Standort *</Label>
              <Input
                id="location"
                value={property.location}
                onChange={(e) => setProperty(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Stadt, Region"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={property.description}
              onChange={(e) => setProperty(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Beschreibung der Unterkunft..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="price">Preis pro Nacht (€) *</Label>
              <Input
                id="price"
                type="number"
                value={property.price}
                onChange={(e) => setProperty(prev => ({ ...prev, price: e.target.value }))}
                placeholder="200"
              />
            </div>
            <div>
              <Label htmlFor="guests">Max. Gäste</Label>
              <Input
                id="guests"
                type="number"
                value={property.guests}
                onChange={(e) => setProperty(prev => ({ ...prev, guests: e.target.value }))}
                placeholder="6"
              />
            </div>
            <div>
              <Label htmlFor="bedrooms">Schlafzimmer</Label>
              <Input
                id="bedrooms"
                type="number"
                value={property.bedrooms}
                onChange={(e) => setProperty(prev => ({ ...prev, bedrooms: e.target.value }))}
                placeholder="3"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Badezimmer</Label>
              <Input
                id="bathrooms"
                type="number"
                value={property.bathrooms}
                onChange={(e) => setProperty(prev => ({ ...prev, bathrooms: e.target.value }))}
                placeholder="2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="size">Wohnfläche (qm)</Label>
              <Input
                id="size"
                type="number"
                value={property.size}
                onChange={(e) => setProperty(prev => ({ ...prev, size: e.target.value }))}
                placeholder="140"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={property.status} onValueChange={(value) => setProperty(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Status wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bilder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Bild URL hinzufügen"
              />
              <Button onClick={addImage} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Bild ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ausstattung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Ausstattung hinzufügen"
              />
              <Button onClick={addFeature} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weitere Ausstattung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Weitere Ausstattung hinzufügen"
              />
              <Button onClick={addAmenity} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{amenity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAmenity(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hausregeln</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkin">Check-in Zeit</Label>
              <Input
                id="checkin"
                value={property.houseRules.checkIn}
                onChange={(e) => setProperty(prev => ({
                  ...prev,
                  houseRules: { ...prev.houseRules, checkIn: e.target.value }
                }))}
                placeholder="15:00"
              />
            </div>
            <div>
              <Label htmlFor="checkout">Check-out Zeit</Label>
              <Input
                id="checkout"
                value={property.houseRules.checkOut}
                onChange={(e) => setProperty(prev => ({
                  ...prev,
                  houseRules: { ...prev.houseRules, checkOut: e.target.value }
                }))}
                placeholder="11:00"
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="smoking">Rauchen erlaubt</Label>
              <Switch
                id="smoking"
                checked={property.houseRules.smokingAllowed}
                onCheckedChange={(checked) => setProperty(prev => ({
                  ...prev,
                  houseRules: { ...prev.houseRules, smokingAllowed: checked }
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="pets">Haustiere erlaubt</Label>
              <Switch
                id="pets"
                checked={property.houseRules.petsAllowed}
                onCheckedChange={(checked) => setProperty(prev => ({
                  ...prev,
                  houseRules: { ...prev.houseRules, petsAllowed: checked }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stornierungsbedingungen</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={property.cancellation}
            onChange={(e) => setProperty(prev => ({ ...prev, cancellation: e.target.value }))}
            placeholder="Stornierungsbedingungen..."
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Abbrechen
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Speichern...' : 'Speichern'}
        </Button>
      </div>
    </div>
  )
}

export default PropertyEditor