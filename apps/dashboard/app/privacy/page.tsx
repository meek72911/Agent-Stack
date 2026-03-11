import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy - AgentStack",
  description: "AgentStack privacy policy and data protection information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        
        <p><strong>Effective Date:</strong> March 2026</p>
        
        <h2>Introduction</h2>
        <p>
          AgentStack ("we," "our," or "us") is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, and protect your information 
          when you use our AI workflow automation platform.
        </p>
        
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us, such as:</p>
        <ul>
          <li>Name and email address when you create an account</li>
          <li>API keys and authentication tokens (encrypted)</li>
          <li>Workflow configurations and execution data</li>
          <li>Usage analytics and performance metrics</li>
        </ul>
        
        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and maintain our service</li>
          <li>Process your workflow executions</li>
          <li>Send you important updates and support communications</li>
          <li>Analyze usage patterns to improve our service</li>
        </ul>
        
        <h2>Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your data:
        </p>
        <ul>
          <li>All API keys are encrypted with AES-256</li>
          <li>Data is transmitted using HTTPS/TLS encryption</li>
          <li>Access to data is strictly controlled and logged</li>
        </ul>
        
        <h2>Contact Information</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us:
        </p>
        <ul>
          <li><strong>Company:</strong> AgentStack</li>
          <li><strong>Owner:</strong> Sarthak Khedkar</li>
          <li><strong>Email:</strong> privacy@agentstack.dev</li>
          <li><strong>Location:</strong> Pune, India</li>
        </ul>
        
        <div className="mt-8">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
