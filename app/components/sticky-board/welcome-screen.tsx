import React from "react";
import { StickyNote, Sparkles, Users, Layers } from "lucide-react";
import { AuthForm } from "./auth-form";

export function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-600 rounded-full p-4 mr-4">
                <StickyNote className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Sticky Notes Canvas
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create, organize, and collaborate with infinite sticky notes on a
              beautiful canvas. Perfect for brainstorming, planning, and visual
              thinking.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Features */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our Sticky Notes?
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Infinite Canvas
                    </h3>
                    <p className="text-gray-600">
                      Pan, zoom, and explore an unlimited workspace. Your ideas
                      have no boundaries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 rounded-lg p-3 mr-4">
                    <Layers className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Multiple Canvases
                    </h3>
                    <p className="text-gray-600">
                      Organize your work with separate canvases for different
                      projects or topics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-lg p-3 mr-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Multi-User Support
                    </h3>
                    <p className="text-gray-600">
                      Create separate accounts for team members or personal use
                      cases.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ✨ Features Include:
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div>• Drag & drop notes</div>
                    <div>• Color customization</div>
                    <div>• Touch/mobile support</div>
                    <div>• Auto-save</div>
                    <div>• Mini-map navigation</div>
                    <div>• Grid background</div>
                    <div>• Zoom controls</div>
                    <div>• Dark/light themes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Form */}
            <div className="lg:pl-8">
              <AuthForm />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-gray-500 text-sm">
            <p>
              Start organizing your thoughts today. Create an account or sign in
              to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
