import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service - AgentStack",
  description: "AgentStack terms of service and usage agreement.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1>Terms of Service</h1>
        
        <p><strong>Effective Date:</strong> March 2026</p>
        
        <h2>Agreement</h2>
        <p>
          By using AgentStack ("the Service"), you agree to be bound by these Terms of Service 
          ("Terms"). If you do not agree to these Terms, please do not use our Service.
        </p>
        
        <h2>Description of Service</h2>
        <p>
          AgentStack is an AI workflow automation platform that provides:
        </p>
        <ul>
          <li>Pre-built AI agent templates</li>
          <li>Workflow execution and management</li>
          <li>Multi-tenant workspace management</li>
          <li>Usage analytics and monitoring</li>
        </ul>
        
        <h2>User Responsibilities</h2>
        <p>As a user, you agree to:</p>
        <ul>
          <li>Provide accurate information when creating an account</li>
          <li>Use your own API keys and authentication tokens</li>
          <li>Not use the Service for illegal or harmful activities</li>
          <li>Respect rate limits and fair usage policies</li>
        </ul>
        
        <h2>Payment and Subscription</h2>
        <p>
          Our paid plans are billed monthly or annually. You can cancel your subscription 
          at any time. Refunds are provided on a case-by-case basis.
        </p>
        
        <h2>Intellectual Property</h2>
        <p>
          You retain ownership of your data and workflows. AgentStack retains ownership 
          of the platform and underlying technology.
        </p>
        
        <h2>Limitation of Liability</h2>
        <p>
          AgentStack is provided "as is" without warranties. We are not liable for any 
          indirect, incidental, or consequential damages arising from your use of the Service.
        </p>
        
        <h2>Contact Information</h2>
        <p>
          For questions about these Terms, please contact us:
        </p>
        <ul>
          <li><strong>Company:</strong> AgentStack</li>
          <li><strong>Owner:</strong> Sarthak Khedkar</li>
          <li><strong>Email:</strong> legal@agentstack.dev</li>
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
