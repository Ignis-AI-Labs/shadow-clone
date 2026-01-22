import { describe, test, expect } from 'bun:test';
import { validateToolInput, createSafeValidationError } from '../../src/utils/zodValidation';
import { z } from 'zod';

describe('Tool Schema Validation', () => {
  describe('deploy_agent_team', () => {
    test('accepts valid input', () => {
      const result = validateToolInput('deploy_agent_team', {
        teamType: 'frontend',
        task: 'Build a dashboard'
      }) as Record<string, unknown>;
      expect(result.teamType).toBe('frontend');
      expect(result.task).toBe('Build a dashboard');
    });

    test('rejects invalid teamType', () => {
      expect(() => validateToolInput('deploy_agent_team', {
        teamType: 'invalid',
        task: 'Build a dashboard'
      })).toThrow();
    });

    test('coerces teamSize string to number', () => {
      const result = validateToolInput('deploy_agent_team', {
        teamType: 'backend',
        task: 'Build API',
        teamSize: '3'
      }) as Record<string, unknown>;
      expect(result.teamSize).toBe(3);
    });

    test('rejects teamSize out of range', () => {
      expect(() => validateToolInput('deploy_agent_team', {
        teamType: 'backend',
        task: 'Build API',
        teamSize: 10
      })).toThrow();
    });

    test('accepts all valid teamTypes', () => {
      const types = ['frontend', 'backend', 'database', 'testing', 'documentation', 'devops', 'mobile', 'security'];
      types.forEach(type => {
        const result = validateToolInput('deploy_agent_team', {
          teamType: type,
          task: 'Test task'
        }) as Record<string, unknown>;
        expect(result.teamType).toBe(type);
      });
    });
  });

  describe('deploy_specialist_agent', () => {
    test('accepts valid input', () => {
      const result = validateToolInput('deploy_specialist_agent', {
        specialization: 'react_expert',
        task: 'Optimize hooks'
      }) as Record<string, unknown>;
      expect(result.specialization).toBe('react_expert');
    });

    test('accepts all valid specializations', () => {
      const specs = [
        'react_expert', 'api_designer', 'database_architect', 'test_engineer',
        'performance_analyst', 'security_auditor', 'code_reviewer', 'documentation_writer'
      ];
      specs.forEach(spec => {
        const result = validateToolInput('deploy_specialist_agent', {
          specialization: spec,
          task: 'Test task'
        }) as Record<string, unknown>;
        expect(result.specialization).toBe(spec);
      });
    });

    test('accepts optional deliverables array', () => {
      const result = validateToolInput('deploy_specialist_agent', {
        specialization: 'api_designer',
        task: 'Design REST API',
        deliverables: ['API spec', 'Swagger docs']
      }) as Record<string, unknown>;
      expect(result.deliverables).toEqual(['API spec', 'Swagger docs']);
    });
  });

  describe('quick_fix', () => {
    test('accepts all valid issueTypes', () => {
      const types = ['bug', 'style', 'logic', 'performance', 'security'];
      types.forEach(type => {
        const result = validateToolInput('quick_fix', {
          issueType: type,
          description: 'Fix the issue'
        }) as Record<string, unknown>;
        expect(result.issueType).toBe(type);
      });
    });

    test('accepts optional urgency levels', () => {
      const urgencies = ['low', 'medium', 'high', 'critical'];
      urgencies.forEach(urgency => {
        const result = validateToolInput('quick_fix', {
          issueType: 'bug',
          description: 'Fix issue',
          urgency
        }) as Record<string, unknown>;
        expect(result.urgency).toBe(urgency);
      });
    });

    test('rejects missing description', () => {
      expect(() => validateToolInput('quick_fix', {
        issueType: 'bug'
      })).toThrow();
    });
  });

  describe('code_review_team', () => {
    test('accepts valid input with files array', () => {
      const result = validateToolInput('code_review_team', {
        reviewType: 'security',
        files: ['auth.js', 'login.js']
      }) as Record<string, unknown>;
      expect(result.reviewType).toBe('security');
      expect(result.files).toEqual(['auth.js', 'login.js']);
    });

    test('rejects empty files array', () => {
      expect(() => validateToolInput('code_review_team', {
        reviewType: 'security',
        files: []
      })).toThrow();
    });

    test('accepts all valid reviewTypes', () => {
      const types = ['security', 'performance', 'quality', 'architecture', 'comprehensive'];
      types.forEach(type => {
        const result = validateToolInput('code_review_team', {
          reviewType: type,
          files: ['test.js']
        }) as Record<string, unknown>;
        expect(result.reviewType).toBe(type);
      });
    });
  });

  describe('generate_tests', () => {
    test('validates coverage range 0-100', () => {
      expect(() => validateToolInput('generate_tests', {
        testType: 'unit',
        targetFiles: ['utils.js'],
        coverage: 150
      })).toThrow();
    });

    test('accepts coverage at boundaries', () => {
      const result0 = validateToolInput('generate_tests', {
        testType: 'unit',
        targetFiles: ['utils.js'],
        coverage: 0
      }) as Record<string, unknown>;
      expect(result0.coverage).toBe(0);

      const result100 = validateToolInput('generate_tests', {
        testType: 'unit',
        targetFiles: ['utils.js'],
        coverage: 100
      }) as Record<string, unknown>;
      expect(result100.coverage).toBe(100);
    });

    test('coerces coverage string to number', () => {
      const result = validateToolInput('generate_tests', {
        testType: 'unit',
        targetFiles: ['utils.js'],
        coverage: '80'
      }) as Record<string, unknown>;
      expect(result.coverage).toBe(80);
    });

    test('accepts all valid testTypes', () => {
      const types = ['unit', 'integration', 'e2e', 'performance', 'security'];
      types.forEach(type => {
        const result = validateToolInput('generate_tests', {
          testType: type,
          targetFiles: ['test.js']
        }) as Record<string, unknown>;
        expect(result.testType).toBe(type);
      });
    });
  });

  describe('execute_single_wave', () => {
    test('accepts valid input', () => {
      const result = validateToolInput('execute_single_wave', {
        waveType: 'research',
        scope: 'Investigate OAuth best practices'
      }) as Record<string, unknown>;
      expect(result.waveType).toBe('research');
    });

    test('validates maxAgents range 1-10', () => {
      expect(() => validateToolInput('execute_single_wave', {
        waveType: 'implementation',
        scope: 'Build feature',
        maxAgents: 15
      })).toThrow();
    });

    test('accepts all valid waveTypes', () => {
      const types = ['research', 'planning', 'implementation', 'testing', 'documentation', 'review'];
      types.forEach(type => {
        const result = validateToolInput('execute_single_wave', {
          waveType: type,
          scope: 'Test scope'
        }) as Record<string, unknown>;
        expect(result.waveType).toBe(type);
      });
    });
  });

  describe('create_documentation', () => {
    test('accepts valid input', () => {
      const result = validateToolInput('create_documentation', {
        docType: 'api',
        scope: 'REST endpoints'
      }) as Record<string, unknown>;
      expect(result.docType).toBe('api');
    });

    test('accepts all valid docTypes', () => {
      const types = ['api', 'user_guide', 'developer', 'architecture', 'inline'];
      types.forEach(type => {
        const result = validateToolInput('create_documentation', {
          docType: type,
          scope: 'Test scope'
        }) as Record<string, unknown>;
        expect(result.docType).toBe(type);
      });
    });

    test('accepts optional format and audience', () => {
      const result = validateToolInput('create_documentation', {
        docType: 'api',
        scope: 'REST endpoints',
        format: 'openapi',
        audience: 'developers'
      }) as Record<string, unknown>;
      expect(result.format).toBe('openapi');
      expect(result.audience).toBe('developers');
    });
  });

  describe('architecture_consultant', () => {
    test('accepts valid input', () => {
      const result = validateToolInput('architecture_consultant', {
        consultationType: 'design_review',
        context: 'Microservices architecture'
      }) as Record<string, unknown>;
      expect(result.consultationType).toBe('design_review');
    });

    test('accepts all valid consultationTypes', () => {
      const types = ['design_review', 'pattern_recommendation', 'scalability_analysis', 'migration_planning'];
      types.forEach(type => {
        const result = validateToolInput('architecture_consultant', {
          consultationType: type,
          context: 'Test context'
        }) as Record<string, unknown>;
        expect(result.consultationType).toBe(type);
      });
    });
  });

  describe('show_commands', () => {
    test('accepts empty object', () => {
      const result = validateToolInput('show_commands', {}) as Record<string, unknown>;
      expect(result).toBeDefined();
    });

    test('accepts valid category', () => {
      const categories = ['orchestration', 'teams', 'rapid', 'documentation', 'all'];
      categories.forEach(category => {
        const result = validateToolInput('show_commands', { category }) as Record<string, unknown>;
        expect(result.category).toBe(category);
      });
    });
  });

  describe('shadow_clone_orchestrate', () => {
    test('accepts valid input', () => {
      const result = validateToolInput('shadow_clone_orchestrate', {
        mode: 'feature',
        projectDescription: 'Build a user authentication system'
      }) as Record<string, unknown>;
      expect(result.mode).toBe('feature');
    });

    test('rejects projectDescription too short', () => {
      expect(() => validateToolInput('shadow_clone_orchestrate', {
        mode: 'feature',
        projectDescription: 'short'  // Less than 10 chars
      })).toThrow();
    });

    test('accepts all valid modes', () => {
      const modes = ['plan', 'feature', 'debug', 'optimize', 'refactor', 'audit', 'research'];
      modes.forEach(mode => {
        const result = validateToolInput('shadow_clone_orchestrate', {
          mode,
          projectDescription: 'This is a valid project description'
        }) as Record<string, unknown>;
        expect(result.mode).toBe(mode);
      });
    });
  });

  describe('shadow_clone_plan', () => {
    test('accepts valid input', () => {
      const result = validateToolInput('shadow_clone_plan', {
        projectVision: 'Build a comprehensive e-commerce platform with user management'
      }) as Record<string, unknown>;
      expect(result.projectVision).toContain('e-commerce');
    });

    test('rejects projectVision too short', () => {
      expect(() => validateToolInput('shadow_clone_plan', {
        projectVision: 'Too short'  // Less than 20 chars
      })).toThrow();
    });
  });

  describe('api_key_status', () => {
    test('accepts empty object', () => {
      const result = validateToolInput('api_key_status', {}) as Record<string, unknown>;
      expect(result.showKey).toBe(false);  // Default value
    });

    test('coerces showKey to boolean', () => {
      const result = validateToolInput('api_key_status', {
        showKey: 'true'
      }) as Record<string, unknown>;
      expect(result.showKey).toBe(true);
    });
  });

  describe('initialize_workspace', () => {
    test('accepts empty object with defaults', () => {
      const result = validateToolInput('initialize_workspace', {}) as Record<string, unknown>;
      expect(result.overwrite).toBe(false);  // Default value
    });

    test('accepts valid includeTypes array', () => {
      const result = validateToolInput('initialize_workspace', {
        includeTypes: ['claude', 'github']
      }) as Record<string, unknown>;
      expect(result.includeTypes).toEqual(['claude', 'github']);
    });
  });

  describe('logout', () => {
    test('accepts empty object', () => {
      const result = validateToolInput('logout', {});
      expect(result).toBeDefined();
    });

    test('handles null args', () => {
      const result = validateToolInput('logout', null);
      expect(result).toBeDefined();
    });

    test('handles undefined args', () => {
      const result = validateToolInput('logout', undefined);
      expect(result).toBeDefined();
    });
  });

  describe('get_agent_template', () => {
    test('accepts valid templateType', () => {
      const result = validateToolInput('get_agent_template', {
        templateType: 'core_rules'
      }) as Record<string, unknown>;
      expect(result.templateType).toBe('core_rules');
    });

    test('accepts all valid templateTypes', () => {
      const types = ['core_rules', 'agent_template', 'team_templates'];
      types.forEach(type => {
        const result = validateToolInput('get_agent_template', {
          templateType: type
        }) as Record<string, unknown>;
        expect(result.templateType).toBe(type);
      });
    });

    test('rejects invalid templateType', () => {
      expect(() => validateToolInput('get_agent_template', {
        templateType: 'invalid_type'
      })).toThrow();
    });

    test('rejects missing templateType', () => {
      expect(() => validateToolInput('get_agent_template', {})).toThrow();
    });
  });

  describe('authenticate', () => {
    test('accepts empty object', () => {
      const result = validateToolInput('authenticate', {});
      expect(result).toBeDefined();
    });

    test('handles null args', () => {
      const result = validateToolInput('authenticate', null);
      expect(result).toBeDefined();
    });
  });

  describe('check_for_updates', () => {
    test('accepts empty object', () => {
      const result = validateToolInput('check_for_updates', {});
      expect(result).toBeDefined();
    });

    test('handles null args', () => {
      const result = validateToolInput('check_for_updates', null);
      expect(result).toBeDefined();
    });
  });

  describe('Error messages', () => {
    test('does not leak internal paths', () => {
      let errorThrown = false;
      try {
        validateToolInput('deploy_agent_team', { teamType: 123, task: 'test' });
      } catch (error: unknown) {
        errorThrown = true;
        const message = (error as Error).message;
        expect(message).not.toContain('/home/');
        expect(message).not.toContain('/Users/');
        expect(message).not.toContain('node_modules');
        expect(message).not.toContain('\\Users\\');
      }
      expect(errorThrown).toBe(true);
    });

    test('provides helpful error for invalid enum', () => {
      let errorThrown = false;
      try {
        validateToolInput('deploy_agent_team', { teamType: 'invalid_type', task: 'test' });
      } catch (error: unknown) {
        errorThrown = true;
        const message = (error as Error).message;
        expect(message).toContain('teamType');
        expect(message).toContain('must be one of');
      }
      expect(errorThrown).toBe(true);
    });

    test('provides helpful error for missing required field', () => {
      let errorThrown = false;
      try {
        validateToolInput('deploy_agent_team', { teamType: 'frontend' });
      } catch (error: unknown) {
        errorThrown = true;
        const message = (error as Error).message;
        expect(message).toContain('task');
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe('Path security', () => {
    test('rejects directory traversal in paths', () => {
      expect(() => validateToolInput('initialize_workspace', {
        projectPath: '../../../etc/passwd'
      })).toThrow('cannot contain directory traversal');
    });

    test('rejects forbidden paths (.git)', () => {
      expect(() => validateToolInput('initialize_workspace', {
        projectPath: '.git/config'
      })).toThrow('contains forbidden path');
    });

    test('rejects forbidden paths (.env)', () => {
      expect(() => validateToolInput('shadow_clone_orchestrate', {
        mode: 'feature',
        projectDescription: 'Valid description here',
        projectPlan: '.env.local'
      })).toThrow('contains forbidden path');
    });

    test('rejects directory traversal in file arrays', () => {
      expect(() => validateToolInput('code_review_team', {
        reviewType: 'security',
        files: ['valid.js', '../../../etc/passwd']
      })).toThrow('cannot contain directory traversal');
    });

    test('rejects forbidden paths in file arrays', () => {
      expect(() => validateToolInput('generate_tests', {
        testType: 'unit',
        targetFiles: ['utils.js', '.git/hooks/pre-commit']
      })).toThrow('contains forbidden path');
    });

    test('accepts valid paths', () => {
      const result = validateToolInput('initialize_workspace', {
        projectPath: './my-project/src'
      }) as Record<string, unknown>;
      expect(result.projectPath).toBe('./my-project/src');
    });

    test('accepts valid file arrays', () => {
      const result = validateToolInput('code_review_team', {
        reviewType: 'security',
        files: ['src/auth.js', 'src/login.ts']
      }) as Record<string, unknown>;
      expect(result.files).toEqual(['src/auth.js', 'src/login.ts']);
    });
  });

  describe('createSafeValidationError', () => {
    test('formats invalid_type error correctly', () => {
      // Zod 4 format: uses 'expected' property
      const zodError = new z.ZodError([{
        code: 'invalid_type',
        expected: 'string',
        path: ['teamType'],
        message: 'Invalid type'
      }] as unknown as z.ZodIssue[]);
      const error = createSafeValidationError(zodError);
      expect(error.message).toContain('teamType');
      expect(error.message).toContain('expected string');
    });

    test('formats invalid_value error correctly', () => {
      // Zod 4 format: uses 'invalid_value' with 'values' property
      const zodError = new z.ZodError([{
        code: 'invalid_value',
        values: ['a', 'b', 'c'],
        path: ['field'],
        message: 'Invalid value'
      }] as unknown as z.ZodIssue[]);
      const error = createSafeValidationError(zodError);
      expect(error.message).toContain('field');
      expect(error.message).toContain('must be one of');
    });

    test('formats too_small string error correctly', () => {
      // Zod 4 format: uses 'origin' instead of 'type'
      const zodError = new z.ZodError([{
        code: 'too_small',
        origin: 'string',
        minimum: 10,
        inclusive: true,
        path: ['description'],
        message: 'Too small'
      }] as unknown as z.ZodIssue[]);
      const error = createSafeValidationError(zodError);
      expect(error.message).toContain('description');
      expect(error.message).toContain('at least 10');
    });

    test('formats too_big string error correctly', () => {
      // Zod 4 format: uses 'origin' instead of 'type'
      const zodError = new z.ZodError([{
        code: 'too_big',
        origin: 'string',
        maximum: 100,
        inclusive: true,
        path: ['task'],
        message: 'Too big'
      }] as unknown as z.ZodIssue[]);
      const error = createSafeValidationError(zodError);
      expect(error.message).toContain('task');
      expect(error.message).toContain('at most 100');
    });
  });

  describe('Unknown tools passthrough', () => {
    test('passes through args for unknown tools', () => {
      const args = { custom: 'value', number: 42 };
      const result = validateToolInput('unknown_tool', args);
      expect(result).toEqual(args);
    });
  });

  describe('Null/undefined handling', () => {
    test('handles null args', () => {
      const result = validateToolInput('show_commands', null);
      expect(result).toBeDefined();
    });

    test('handles undefined args', () => {
      const result = validateToolInput('show_commands', undefined);
      expect(result).toBeDefined();
    });
  });
});
