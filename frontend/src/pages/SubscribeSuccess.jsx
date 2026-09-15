import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

function SubscribeSuccess() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <CheckCircle size={64} className="mx-auto text-ochre mb-6" />
        <h1 className="text-4xl font-extrabold text-ink">You're subscribed!</h1>
        <p className="mt-4 text-ink/60">
          Thanks for joining SubraGlaze. We'll send you our best reads — no spam, just good writing.
        </p>
        <div className="mt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-ochre hover:text-ochre/80 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to stories
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default SubscribeSuccess;