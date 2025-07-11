import { useState, useEffect } from 'react'
import { Calendar, Euro, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { pricingStorage, type PricingRule, formatDate, generateId } from '@/utils/localStorage'

interface CalendarPricingProps {
  propertyId: string
  basePrice: number
  onPriceUpdate?: () => void
}

const CalendarPricing = ({ propertyId, basePrice, onPriceUpdate }: CalendarPricingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [customPrice, setCustomPrice] = useState(basePrice.toString())
  const [isAvailable, setIsAvailable] = useState(true)
  const [minimumStay, setMinimumStay] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [bulkPricing, setBulkPricing] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    price: basePrice.toString(),
    available: true,
    minimumStay: 1
  })

  useEffect(() => {
    loadPricingRules()
  }, [propertyId])

  const loadPricingRules = () => {
    try {
      const rules = pricingStorage.getByProperty(propertyId)
      setPricingRules(rules.sort((a, b) => a.date.localeCompare(b.date)))
    } catch (error) {
      console.error('Error loading pricing rules:', error)
      setPricingRules([])
    }
  }

  // Helper functions for calendar display
  // These will be used later for enhanced calendar features

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    
    setSelectedDate(date)
    const dateStr = formatDate(date)
    const rule = pricingRules.find(r => r.date === dateStr)
    
    if (rule) {
      setCustomPrice(rule.price.toString())
      setIsAvailable(rule.available)
      setMinimumStay(rule.minimum_stay)
    } else {
      setCustomPrice(basePrice.toString())
      setIsAvailable(true)
      setMinimumStay(1)
    }
  }

  const handleSavePricing = () => {
    if (!selectedDate) return
    
    setIsLoading(true)
    try {
      const dateStr = formatDate(selectedDate)
      const price = parseInt(customPrice)
      
      // Check if rule exists
      const existingRule = pricingRules.find(r => r.date === dateStr)
      
      if (existingRule) {
        // Update existing rule
        pricingStorage.update(existingRule.id, {
          price,
          available: isAvailable,
          minimum_stay: minimumStay
        })
        
        setPricingRules(prev => prev.map(rule => 
          rule.id === existingRule.id 
            ? { ...rule, price, available: isAvailable, minimum_stay: minimumStay }
            : rule
        ))
      } else {
        // Create new rule
        const newRule: PricingRule = {
          id: generateId('pricing'),
          property_id: propertyId,
          date: dateStr,
          price,
          available: isAvailable,
          minimum_stay: minimumStay,
          created_at: new Date().toISOString()
        }
        
        pricingStorage.add(newRule)
        setPricingRules(prev => [...prev, newRule])
      }
      
      toast({ title: 'Erfolg', description: 'Preiseinstellungen gespeichert' })
      onPriceUpdate?.()
    } catch (error) {
      console.error('Error saving pricing:', error)
      toast({ title: 'Fehler', description: 'Fehler beim Speichern der Preiseinstellungen', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkPricing = () => {
    if (!bulkPricing.startDate || !bulkPricing.endDate) {
      toast({ title: 'Fehler', description: 'Bitte wählen Sie Start- und Enddatum', variant: 'destructive' })
      return
    }
    
    setIsLoading(true)
    try {
      const startDate = new Date(bulkPricing.startDate)
      const endDate = new Date(bulkPricing.endDate)
      const price = parseInt(bulkPricing.price)
      
      // Generate rules for date range
      const currentDate = new Date(startDate)
      const newRules: PricingRule[] = []
      
      while (currentDate <= endDate) {
        const dateStr = formatDate(currentDate)
        const existingRule = pricingRules.find(r => r.date === dateStr)
        
        if (existingRule) {
          // Update existing rule
          pricingStorage.update(existingRule.id, {
            price,
            available: bulkPricing.available,
            minimum_stay: bulkPricing.minimumStay
          })
          
          newRules.push({
            ...existingRule,
            price,
            available: bulkPricing.available,
            minimum_stay: bulkPricing.minimumStay
          })
        } else {
          // Create new rule
          const newRule: PricingRule = {
            id: generateId('pricing'),
            property_id: propertyId,
            date: dateStr,
            price,
            available: bulkPricing.available,
            minimum_stay: bulkPricing.minimumStay,
            created_at: new Date().toISOString()
          }
          
          pricingStorage.add(newRule)
          newRules.push(newRule)
        }
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      // Update local state
      setPricingRules(prev => {
        const filtered = prev.filter(rule => {
          const ruleDate = new Date(rule.date)
          return ruleDate < startDate || ruleDate > endDate
        })
        return [...filtered, ...newRules].sort((a, b) => a.date.localeCompare(b.date))
      })
      
      toast({ title: 'Erfolg', description: 'Bulk-Preiseinstellungen gespeichert' })
      setBulkPricing({
        startDate: undefined,
        endDate: undefined,
        price: basePrice.toString(),
        available: true,
        minimumStay: 1
      })
      onPriceUpdate?.()
    } catch (error) {
      console.error('Error saving bulk pricing:', error)
      toast({ title: 'Fehler', description: 'Fehler beim Speichern der Bulk-Preiseinstellungen', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const removePricingRule = (ruleId: string) => {
    try {
      pricingStorage.delete(ruleId)
      setPricingRules(prev => prev.filter(rule => rule.id !== ruleId))
      toast({ title: 'Erfolg', description: 'Preisregel entfernt' })
      onPriceUpdate?.()
    } catch (error) {
      console.error('Error removing pricing rule:', error)
      toast({ title: 'Fehler', description: 'Fehler beim Entfernen der Preisregel', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Kalenderverwaltung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
                  <span className="text-sm">Individueller Preis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                  <span className="text-sm">Nicht verfügbar</span>
                </div>
              </div>
            </div>
            
            {/* Selected Date Settings */}
            <div className="space-y-4">
              {selectedDate && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">
                    Einstellungen für {selectedDate.toLocaleDateString('de-DE')}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="price">Preis pro Nacht (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        min="0"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="available">Verfügbar</Label>
                      <Switch
                        id="available"
                        checked={isAvailable}
                        onCheckedChange={setIsAvailable}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="minStay">Mindestaufenthalt (Nächte)</Label>
                      <Select value={minimumStay.toString()} onValueChange={(value) => setMinimumStay(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Nacht' : 'Nächte'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleSavePricing}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Speichern...' : 'Einstellungen speichern'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Euro className="w-5 h-5 mr-2" />
            Bulk-Preiseinstellungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Startdatum</Label>
              <CalendarComponent
                mode="single"
                selected={bulkPricing.startDate}
                onSelect={(date) => setBulkPricing(prev => ({ ...prev, startDate: date }))}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
            <div>
              <Label>Enddatum</Label>
              <CalendarComponent
                mode="single"
                selected={bulkPricing.endDate}
                onSelect={(date) => setBulkPricing(prev => ({ ...prev, endDate: date }))}
                disabled={(date) => date < new Date() || (bulkPricing.startDate && date <= bulkPricing.startDate)}
                className="rounded-md border"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="bulkPrice">Preis pro Nacht (€)</Label>
              <Input
                id="bulkPrice"
                type="number"
                value={bulkPricing.price}
                onChange={(e) => setBulkPricing(prev => ({ ...prev, price: e.target.value }))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="bulkMinStay">Mindestaufenthalt</Label>
              <Select 
                value={bulkPricing.minimumStay.toString()} 
                onValueChange={(value) => setBulkPricing(prev => ({ ...prev, minimumStay: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Nacht' : 'Nächte'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="bulkAvailable">Verfügbar</Label>
              <Switch
                id="bulkAvailable"
                checked={bulkPricing.available}
                onCheckedChange={(checked) => setBulkPricing(prev => ({ ...prev, available: checked }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleBulkPricing}
            disabled={isLoading || !bulkPricing.startDate || !bulkPricing.endDate}
            className="w-full mt-4"
          >
            {isLoading ? 'Speichern...' : 'Bulk-Einstellungen anwenden'}
          </Button>
        </CardContent>
      </Card>

      {/* Current Pricing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Aktuelle Preisregeln</CardTitle>
        </CardHeader>
        <CardContent>
          {pricingRules.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Keine benutzerdefinierten Preisregeln vorhanden. Standardpreis: €{basePrice}/Nacht
            </p>
          ) : (
            <div className="space-y-2">
              {pricingRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {new Date(rule.date).toLocaleDateString('de-DE')}
                    </span>
                    <Badge variant={rule.available ? 'default' : 'destructive'}>
                      {rule.available ? 'Verfügbar' : 'Nicht verfügbar'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      €{rule.price}/Nacht
                    </span>
                    <span className="text-sm text-gray-600">
                      Min. {rule.minimum_stay} {rule.minimum_stay === 1 ? 'Nacht' : 'Nächte'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePricingRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CalendarPricing