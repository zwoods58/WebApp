'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Info, X } from 'lucide-react'
import Link from 'next/link'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

interface PricingFeature {
  text: string
  included: boolean
  hasInfo?: boolean
  tooltip?: string
}

interface PricingTier {
  name: string
  subtitle?: string
  price?: string
  period?: string
  description: string
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  features: PricingFeature[]
  buttonText: string
  buttonHref?: string
  buttonVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  highlighted?: boolean
  footerText?: string
  footerLink?: string
}

interface PricingComponentProps {
  title?: string
  subtitle?: string
  tiers: PricingTier[]
  className?: string
}

const PricingComponent: React.FC<PricingComponentProps> = ({
  title = "Simple pricing.",
  subtitle = "Pay for what matters. Enjoy everything else.",
  tiers,
  className
}) => {
  return (
    <div className={cn("w-full bg-transparent relative", className)}>
      {/* Ambient lighting effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.02) 0%, transparent 70%)',
          zIndex: 0
        }}
      />
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-6xl font-bold text-gray-900 mb-6"
            style={{
              fontFamily: 'Encode Sans, sans-serif',
              textShadow: 'none'
            }}
          >
            {title}
          </h1>
          <p className="text-xl text-black font-normal" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
            {subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-md:gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <Card 
              key={index}
              className={cn(
                "relative flex flex-col h-full transition-all duration-300 border-gray-200",
                tier.highlighted 
                  ? "bg-white border-gray-300 shadow-2xl md:scale-105 md:bottom-4 z-20" 
                  : "bg-white border-gray-200 hover:bg-gray-50"
              )}
              style={{
                boxShadow: tier.highlighted 
                  ? '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 40px rgba(0, 0, 0, 0.05)'
                  : '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30">
                  <div 
                    className="bg-teal-600 text-white text-xs font-bold px-4 py-1.5 rounded-full"
                    style={{
                      boxShadow: '0 8px 20px rgba(13, 148, 136, 0.4), 0 0 15px rgba(13, 148, 136, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    {tier.badge.text}
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-12">
                <div className="text-xs font-medium text-gray-600 uppercase tracking-[0.2em] mb-4">
                  {tier.subtitle}
                </div>
                <CardTitle className="mb-6">
                  {tier.price ? (
                    <div className="flex items-baseline justify-center flex-wrap gap-1 min-h-[4rem]">
                      <span 
                        className="text-4xl md:text-5xl font-light text-black break-words leading-tight" 
                        style={{ 
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontFeatureSettings: '"tnum"',
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing: 'normal',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-lg font-light text-gray-600 ml-2">
                          {tier.period}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-5xl font-light text-black">{tier.name}</div>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-700 text-base font-light leading-relaxed px-4">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 px-8">
                <div className="mb-8">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-[0.2em] mb-6">
                    PLAN HIGHLIGHTS
                  </h4>
                  <TooltipProvider>
                    <div className="space-y-4">
                      {tier.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          {feature.included ? <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> : <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />}
                          {feature.tooltip || feature.hasInfo ? (
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <span className="text-gray-800 text-sm font-light flex items-center gap-2 leading-relaxed cursor-help border-b border-dashed border-gray-400/50 hover:border-gray-600/70 transition-colors">
                                  {feature.text}
                                  {feature.hasInfo && (
                                    <Info className="h-3 w-3 text-gray-600" />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs bg-white border-gray-300 shadow-lg">
                                <p className="text-sm text-black">{feature.tooltip || 'Additional information'}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-gray-800 text-sm font-light flex items-center gap-2 leading-relaxed">
                              {feature.text}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TooltipProvider>
                </div>
              </CardContent>

              <CardFooter className="px-8 pb-8">
                <div className="w-full">
                  {tier.buttonHref ? (
                    <Link href={tier.buttonHref} className="block">
                      {tier.highlighted ? (
                        <Button 
                          className="w-full py-4 text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white border-0 transition-all duration-300"
                          style={{
                            boxShadow: '0 8px 25px rgba(13, 148, 136, 0.4), 0 0 15px rgba(13, 148, 136, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          {tier.buttonText}
                        </Button>
                      ) : (
                        <Button 
                          className={cn(
                            "w-full py-4 text-sm font-medium transition-all duration-300",
                            "bg-black hover:bg-gray-800 text-white border-gray-300"
                          )}
                          variant="secondary"
                          style={{
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          {tier.buttonText}
                        </Button>
                      )}
                    </Link>
                  ) : (
                    <>
                      {tier.highlighted ? (
                        <Button 
                          className="w-full py-4 text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white border-0 transition-all duration-300"
                          style={{
                            boxShadow: '0 8px 25px rgba(13, 148, 136, 0.4), 0 0 15px rgba(13, 148, 136, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          {tier.buttonText}
                        </Button>
                      ) : (
                        <Button 
                          className={cn(
                            "w-full py-4 text-sm font-medium transition-all duration-300",
                            "bg-black hover:bg-gray-800 text-white border-gray-300"
                          )}
                          variant="secondary"
                          style={{
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          {tier.buttonText}
                        </Button>
                      )}
                    </>
                  )}
                  {tier.footerText && (
                    <div className="text-center mt-6">
                      <p className="text-xs text-gray-600 font-light">
                        {tier.footerText}{' '}
                        {tier.footerLink && (
                          <button className="text-black hover:text-gray-800 underline transition-colors">
                            {tier.footerLink}
                          </button>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingComponent

