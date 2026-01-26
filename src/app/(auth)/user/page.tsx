'use client'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function UserAccountPage() {
    return (
        <div className="min-h-screen bg-white text-black px-6 md:px-20 py-16">
            {/* Header */}
            <header className="mb-20">
                <h1 className="text-4xl md:text-6xl font-serif tracking-tight">MY ACCOUNT</h1>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Profile */}
                <section>
                    <h2 className="text-xl font-serif mb-6">PROFILE</h2>
                    <Card className="rounded-2xl shadow-sm">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex justify-between">
                                <span className="uppercase text-xs tracking-widest text-gray-500">Name</span>
                                <span className="font-light">Pratul Wadhwa</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="uppercase text-xs tracking-widest text-gray-500">Email</span>
                                <span className="font-light">user@email.com</span>
                            </div>
                            <Button variant="outline" className="mt-6 w-full rounded-full">EDIT PROFILE</Button>
                        </CardContent>
                    </Card>
                </section>

                {/* Orders */}
                <section>
                    <h2 className="text-xl font-serif mb-6">ORDERS</h2>
                    <Card className="rounded-2xl shadow-sm">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-center border-b py-4">
                                <span className="font-light">Order #23901</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="font-light">Order #23877</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Address */}
                <section>
                    <h2 className="text-xl font-serif mb-6">ADDRESS BOOK</h2>
                    <Card className="rounded-2xl shadow-sm">
                        <CardContent className="p-8">
                            <p className="font-light leading-relaxed">
                                21 Minimal Street<br />
                                New Delhi, IN 110001
                            </p>
                            <Button variant="outline" className="mt-6 rounded-full">MANAGE ADDRESSES</Button>
                        </CardContent>
                    </Card>
                </section>

                {/* Settings */}
                <section>
                    <h2 className="text-xl font-serif mb-6">SETTINGS</h2>
                    <Card className="rounded-2xl shadow-sm">
                        <CardContent className="p-8 space-y-4">
                            <Button variant="ghost" className="w-full justify-between font-light">Change Password <ChevronRight className="w-4 h-4" /></Button>
                            <Button variant="ghost" className="w-full justify-between font-light">Payment Methods <ChevronRight className="w-4 h-4" /></Button>
                            <Button variant="ghost" className="w-full justify-between font-light text-red-600">Log Out</Button>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
